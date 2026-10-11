import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.85 });

export { gsap, ScrollTrigger };

/** Shared motion tokens (see cinematic-gsap-lenis-motion-system). */
export const MOTION = {
    scrub: 1,
    revealStart: 'top 82%',
    itemStagger: 0.075,
};

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
