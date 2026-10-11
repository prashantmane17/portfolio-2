import React from 'react';
import { ArrowUp } from 'lucide-react';
import { footer, sectionNav, site } from '../../../config/content';
import MaskLines from '../parts/MaskLines';
import SceneFrame from './SceneFrame';
import { useStory } from '../StoryContext';
import { useLenis } from '../../../providers/LenisContext';

/** Section 6: cinematic ending over the dark rear view; navigation, social links, back to top. */
const FooterScene = () => {
    const { goTo } = useStory();
    const lenis = useLenis();

    const backToTop = () => (lenis ? lenis.scrollTo(0, { duration: 2.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' }));

    return (
        <SceneFrame id="footer" titleId="footer-title" scrim="bottom" align="end">
            <div className="pointer-events-auto">
                <MaskLines as="h2" id="footer-title" lines={footer.headline} className="metal-text font-bold text-5xl sm:text-6xl lg:text-8xl" />
                <p data-item className="mt-5 max-w-lg text-lg text-gray-300">
                    {footer.body}
                </p>

                <div data-item className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-t border-white/15 pt-8">
                    <div>
                        <p className="font-heading font-bold text-xl tracking-label text-white">{footer.brand}</p>
                        <p className="label !text-gray-400 mt-1">{footer.brandNote}</p>
                    </div>

                    <nav aria-label="Story sections">
                        <ul className="flex flex-wrap gap-x-5 gap-y-1">
                            {sectionNav.map((item) => (
                                <li key={item.id}>
                                    <button type="button" onClick={() => goTo(item.id)} className="label !text-gray-300 hover:!text-white transition-colors py-1">
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <ul className="flex gap-x-5 whitespace-nowrap" aria-label="Social links">
                        {footer.social.map((s) => (
                            <li key={s.href}>
                                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="label !text-gray-300 hover:!text-white transition-colors py-1 inline-block">
                                    {s.short}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        onClick={backToTop}
                        className="inline-flex shrink-0 whitespace-nowrap items-center gap-2 self-start lg:self-auto border border-white/25 hover:border-white/60 text-white rounded-full px-5 py-2.5 text-xs font-semibold tracking-label transition-colors"
                    >
                        BACK TO TOP
                        <ArrowUp size={16} aria-hidden="true" />
                    </button>
                </div>

                <p data-item className="mt-8 text-xs text-gray-500 max-w-3xl">
                    {site.disclaimer}{' '}
                    <a href={site.source.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
                        {site.source.label}
                    </a>
                    . © {new Date().getFullYear()} Concept study.
                </p>
            </div>
        </SceneFrame>
    );
};

export default FooterScene;
