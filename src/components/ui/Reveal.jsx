import React, { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, MOTION } from '../../lib/gsap';

/**
 * Anchor wrapper that reveals its `[data-scene-item]` / `[data-scene-bar]`
 * descendants once as it scrolls into view (blur-free fade-up, staggered).
 */
const Reveal = ({ id, className, children }) => {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray('[data-scene-item]');
            const bars = gsap.utils.toArray('[data-scene-bar]');
            if (!items.length) return;
            gsap.set(items, { autoAlpha: 0, y: 36 });
            gsap.set(bars, { scaleX: 0 });
            ScrollTrigger.create({
                trigger: ref.current,
                start: MOTION.revealStart,
                once: true,
                onEnter: () => {
                    gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power4.out', stagger: MOTION.itemStagger });
                    gsap.to(bars, { scaleX: 1, duration: 1, delay: 0.5, stagger: 0.08 });
                },
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} id={id} className={className}>
            {children}
        </div>
    );
};

export default Reveal;
