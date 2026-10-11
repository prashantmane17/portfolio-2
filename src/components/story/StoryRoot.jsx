import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, MOTION } from '../../lib/gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useLenis } from '../../providers/LenisContext';
import { totalUnits, unitVh, sectionAt, desktopQuery, reducedMotionQuery } from '../../config/story';
import { StoryContext, createView } from './StoryContext';
import { buildStoryTimeline } from './timeline';

/**
 * The scroll story.
 * pinned (default): one sticky stage; a single scrubbed timeline moves the camera and the copy.
 *   Narrow screens use the same story with a shorter scroll and a pulled-back camera.
 * static (prefers-reduced-motion): no pinning or scrubbing; the sections are an ordinary stack and
 *   the car holds a single pose.
 * `stage` is the 3D layer; children are the six scenes.
 */
const StoryRoot = ({ stage, children }) => {
    const reduce = useMediaQuery(reducedMotionQuery);
    const desktop = useMediaQuery(desktopQuery);
    const lenis = useLenis();
    const mode = reduce ? 'static' : 'pinned';
    const compact = !desktop;
    const rootRef = useRef(null);
    const [view] = useState(createView); // static pose = station 1 (hero hold)

    const vh = compact ? unitVh.mobile : unitVh.desktop;

    useLayoutEffect(() => {
        view.reset(mode === 'pinned' ? 0 : 1);
        if (mode !== 'pinned') return;
        const ctx = gsap.context(() => {
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
            buildStoryTimeline(tl, rootRef.current, view);
            tl.to({}, { duration: Math.max(0, totalUnits - tl.duration()) }, tl.duration());
        }, rootRef);
        return () => ctx.revert();
    }, [mode, compact, view]);

    const goTo = useCallback(
        (id) => {
            const root = rootRef.current;
            if (!root) return;
            const top = mode === 'pinned' ? root.getBoundingClientRect().top + window.scrollY + ((sectionAt[id] ?? 0) * vh * window.innerHeight) / 100 : document.querySelector(`[data-scene="${id}"]`)?.offsetTop ?? 0;
            if (lenis) lenis.scrollTo(top, { duration: 2.2 });
            else window.scrollTo({ top, behavior: 'smooth' });
        },
        [lenis, mode, vh]
    );

    const value = { mode, view, goTo, compact };

    if (mode === 'static') {
        return (
            <StoryContext value={value}>
                <div ref={rootRef} className="relative">
                    {stage}
                    <div className="relative">{children}</div>
                </div>
            </StoryContext>
        );
    }

    return (
        <StoryContext value={value}>
            <div ref={rootRef} className="relative" style={{ height: `${totalUnits * vh + 100}vh` }}>
                {Object.keys(sectionAt).map((id) => (
                    <div key={id} id={id} aria-hidden="true" className="absolute inset-x-0 h-px pointer-events-none" style={{ top: `${sectionAt[id] * vh}vh` }} />
                ))}
                <div className="sticky top-0 h-screen overflow-hidden">
                    {stage}
                    {children}
                </div>
            </div>
        </StoryContext>
    );
};

export default StoryRoot;
