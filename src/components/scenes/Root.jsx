import React, { Children, isValidElement, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, MOTION } from '../../lib/gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ScenesContext, SceneIndexContext } from './context';
import { SCENES } from './config';
import Scene from './Scene';

/**
 * Pinned, scroll-scrubbed stack of scenes over an optional stage canvas (<Scenes.Backdrop>).
 * A scene's `transition` is 'slide' (rises over the previous one) or 'zoom' (driven by the backdrop).
 *
 *   <Scenes.Root>
 *     <Scenes.Backdrop car="..." showreel={...} windshield={[...]} />
 *     <Scenes.Scene id="hero"><Hero /></Scenes.Scene>
 *     <Scenes.Scene id="about"><About /></Scenes.Scene>
 *   </Scenes.Root>
 *
 * Below the media query (or with reduced motion) it degrades to a normal stack.
 */
const Root = ({ children }) => {
    const enabled = useMediaQuery(SCENES.mediaQuery);
    const drawRef = useRef(null);
    const mode = enabled ? 'pinned' : 'stacked';

    let sceneCount = 0;
    const parts = Children.toArray(children).map((child) => {
        if (isValidElement(child) && child.type === Scene) {
            const index = sceneCount++;
            return (
                <SceneIndexContext key={child.key} value={index}>
                    {child}
                </SceneIndexContext>
            );
        }
        return child;
    });
    const ids = Children.toArray(children)
        .filter((c) => isValidElement(c) && c.type === Scene)
        .map((c) => c.props.id);

    return (
        <ScenesContext value={{ mode, drawRef }}>
            {mode === 'pinned' ? (
                <PinnedStage ids={ids}>
                    {parts}
                </PinnedStage>
            ) : (
                parts
            )}
        </ScenesContext>
    );
};

const PinnedStage = ({ ids, children }) => {
    const rootRef = useRef(null);
    const { drawRef } = React.use(ScenesContext);
    const count = ids.length;
    const totalUnits = SCENES.sceneAt(count - 1) + SCENES.tailUnits;

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const scenes = gsap.utils.toArray('[data-scene]');
            const view = { drive: 0, p: 0, e: 0 };
            const stage = scenes[0]?.parentElement.querySelector('[data-stage-layer]');
            const redraw = () => drawRef.current?.(view);

            const tl = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: MOTION.scrub,
                    invalidateOnRefresh: true,
                },
            });

            scenes.forEach((scene, i) => {
                const at = SCENES.sceneAt(i);
                const items = scene.querySelectorAll('[data-scene-item]');
                const bars = scene.querySelectorAll('[data-scene-bar]');
                const kind = scene.dataset.sceneTransition;

                if (i === 0) {
                    // First scene leaves as the next one begins.
                    tl.to(scene, { autoAlpha: 0, x: -40, duration: 0.35 }, 0);
                    return;
                }

                if (kind === 'zoom') {
                    // Car drives along the track, the camera pushes into the windshield, which then opens onto the footage.
                    tl.to(view, { drive: 1, duration: SCENES.drive.duration, ease: 'power1.inOut', onUpdate: redraw }, SCENES.drive.at);
                    tl.to(view, { p: 1, duration: SCENES.dolly.duration, ease: 'power2.inOut', onUpdate: redraw }, SCENES.dolly.at);
                    tl.to(view, { e: 1, duration: SCENES.reveal.duration, ease: 'power2.inOut', onUpdate: redraw }, SCENES.reveal.at);
                    tl.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, at - 0.5);
                } else if (kind === 'push') {
                    // Enters from the left and pushes the previous scene (and the stage) out to the right.
                    const from = at - SCENES.slide;
                    const leaving = [scenes[i - 1], stage].filter(Boolean);
                    tl.fromTo(scene, { xPercent: -100 }, { xPercent: 0, duration: SCENES.slide }, from);
                    tl.to(leaving, { xPercent: 100, duration: SCENES.slide }, from);
                    tl.set(leaving, { autoAlpha: 0 }, at);
                } else {
                    const from = at - SCENES.slide;
                    const previous = scenes[i - 1];
                    // Rise over the previous scene while it drifts up slightly (parallax).
                    tl.fromTo(scene, { yPercent: 100 }, { yPercent: 0, duration: SCENES.slide }, from);
                    tl.to(previous, { yPercent: -12, duration: SCENES.slide }, from);
                    tl.set(previous, { autoAlpha: 0 }, at);
                }

                if (items.length) {
                    tl.fromTo(items, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out', stagger: 0.04 }, at - 0.45);
                }
                if (bars.length) {
                    tl.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power3.out', stagger: 0.03 }, at - 0.2);
                }
            });
            tl.to({}, { duration: SCENES.tailUnits }, SCENES.sceneAt(count - 1));
        }, rootRef);

        return () => ctx.revert();
    }, [count, drawRef]);

    return (
        <div ref={rootRef} className="relative" style={{ height: `${100 + totalUnits * SCENES.unitVh}vh` }}>
            {ids.map((id, i) => (
                <div
                    key={id}
                    id={id}
                    aria-hidden
                    className="absolute inset-x-0 pointer-events-none"
                    style={{
                        top: `${SCENES.sceneAt(i) * SCENES.unitVh}vh`,
                        height: `${(i === count - 1 ? 1 + SCENES.tailUnits : SCENES.sceneAt(i + 1) - SCENES.sceneAt(i)) * SCENES.unitVh}vh`,
                    }}
                />
            ))}
            <div className="sticky top-0 h-screen overflow-hidden">{children}</div>
        </div>
    );
};

export default Root;
