import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';
import { LenisContext } from './LenisContext';

/** Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }) {
    const [lenis, setLenis] = useState(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        const instance = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9, anchors: true });
        const tick = (time) => instance.raf(time * 1000);

        instance.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- publish the instance to context consumers
        setLenis(instance);

        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener('load', onLoad);

        return () => {
            window.removeEventListener('load', onLoad);
            gsap.ticker.remove(tick);
            instance.destroy();
            setLenis(null);
        };
    }, []);

    return <LenisContext value={lenis}>{children}</LenisContext>;
}
