import React, { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../../lib/gsap';
import { hero } from '../../../config/content';
import MaskLines from '../parts/MaskLines';
import SceneFrame from './SceneFrame';
import { useStory } from '../StoryContext';

/** Section 1: copy on the left, car on the right (drawn by the stage). Reveals on load, in order. */
const HeroScene = () => {
    const ref = useRef(null);
    const { goTo } = useStory();

    useLayoutEffect(() => {
        if (prefersReducedMotion()) return;
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray('[data-hero-item]');
            gsap.set('[data-line]', { yPercent: 110 });
            gsap.set(items, { autoAlpha: 0, y: 24 });
            gsap
                .timeline({ delay: 1.2, defaults: { ease: 'power3.out' } })
                .to('[data-hero-eyebrow]', { autoAlpha: 1, y: 0, duration: 0.7 })
                .to('[data-line]', { yPercent: 0, duration: 0.9, stagger: 0.12 }, '-=0.35')
                .to('[data-hero-body]', { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.45');
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref}>
            <SceneFrame id="hero" titleId="hero-title" hidden={false} scrim="left">
                <div className="max-w-lg">
                    <p data-hero-item data-hero-eyebrow className="label">
                        {hero.eyebrow}
                    </p>
                    <MaskLines
                        as="h1"
                        id="hero-title"
                        lines={hero.headline}
                        className="metal-text mt-5 font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight"
                    />
                    <p data-hero-item data-hero-body className="mt-6 text-lg text-gray-300 leading-relaxed">
                        {hero.body}
                    </p>
                    <button
                        type="button"
                        data-hero-item
                        data-hero-body
                        onClick={() => goTo(hero.cta.target)}
                        className="pointer-events-auto mt-8 inline-flex items-center gap-3 bg-primary-500 hover:bg-primary-400 text-white px-7 py-3.5 rounded-full text-sm font-semibold tracking-label transition-colors"
                    >
                        {hero.cta.label}
                        <ArrowUpRight size={18} aria-hidden="true" />
                    </button>
                    <p data-hero-item data-hero-body className="mt-8 text-xs tracking-label text-gray-400">
                        {hero.tagline}
                    </p>
                </div>
            </SceneFrame>
        </div>
    );
};

export default HeroScene;
