import React, { Children, isValidElement, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, MOTION } from '../../lib/gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ScenesContext, SceneIndexContext } from './context';
import { SCENES } from './config';
import Scene from './Scene';

/**
 * Pinned, scroll-scrubbed stack of scenes over a canvas backdrop.
 *
 *   <Scenes.Root>
 *     <Scenes.Backdrop images={[...]} />
 *     <Scenes.Scene id="hero"><Hero /></Scenes.Scene>
 *     <Scenes.Scene id="about"><About /></Scenes.Scene>
 *   </Scenes.Root>
 *
 * Below the media query (or with reduced motion) it degrades to a normal stack.
 */
const Root = ({ children }) => {
    const enabled = useMediaQuery(SCENES.mediaQuery);
    const drawRef = useRef(null);
    const lensRef = useRef(null);
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
        <ScenesContext value={{ mode, drawRef, lensRef }}>
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
    const { drawRef, lensRef } = React.use(ScenesContext);
    const count = ids.length;
    const totalUnits = SCENES.sceneAt(count - 1) + SCENES.tailUnits;

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const scenes = gsap.utils.toArray('[data-scene]');
            const zoom = { p: 0 };
            const lens = scenes[SCENES.lensSceneIndex];

            // The lens scene is only visible through the backdrop's lens ellipses (e.g. the glasses).
            lensRef.current = ({ lenses, done }) => {
                if (!lens) return;
                const ellipse = ({ x, y, rx, ry }) =>
                    `M${(x - rx).toFixed(1)} ${y.toFixed(1)}a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(rx * 2).toFixed(1)} 0a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(-rx * 2).toFixed(1)} 0Z`;
                lens.style.clipPath = done ? 'none' : `path('${lenses.map(ellipse).join('')}')`;
            };
            const redraw = () => drawRef.current?.(zoom.p);

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

            // Backdrop zooms into the focus point (glasses).
            tl.to(zoom, { p: 1, duration: SCENES.zoom.duration, ease: 'power2.inOut', onUpdate: redraw }, SCENES.zoom.at);

            scenes.forEach((scene, i) => {
                const at = SCENES.sceneAt(i);
                const items = scene.querySelectorAll('[data-scene-item]');
                const bars = scene.querySelectorAll('[data-scene-bar]');
                const next = SCENES.sceneAt(i + 1);

                if (i === 0) {
                    tl.to(scene, { autoAlpha: 0, y: -30, duration: 0.3 }, 0);
                } else {
                    // The lens scene is revealed by its clip-path while zooming; others cross-fade in.
                    const showAt = i === SCENES.lensSceneIndex ? SCENES.zoom.at + 0.1 : at - 0.65;
                    tl.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: i === SCENES.lensSceneIndex ? 0.01 : 0.4 }, showAt);
                    if (items.length) {
                        tl.fromTo(items, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out', stagger: 0.04 }, at - 0.3);
                    }
                    if (bars.length) {
                        tl.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power3.out', stagger: 0.03 }, at - 0.1);
                    }
                    if (i < count - 1) tl.to(scene, { autoAlpha: 0, duration: 0.01 }, next - 0.2);
                }
            });
            tl.to({}, { duration: SCENES.tailUnits }, SCENES.sceneAt(count - 1));
        }, rootRef);

        return () => {
            lensRef.current = null;
            ctx.revert();
        };
    }, [count, drawRef, lensRef]);

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
            <div className="sticky top-0 h-screen overflow-hidden bg-dark-900">{children}</div>
        </div>
    );
};

export default Root;
