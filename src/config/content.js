/**
 * All copy for the six-section story. Specifications come from Lamborghini's own
 * Centenario page (lamborghini.com/en-en/history/few-off/centenario); nothing here is invented.
 */

export const site = {
    title: 'Lamborghini Centenario',
    disclaimer:
        'Independent concept website. Not affiliated with, authorised or endorsed by Automobili Lamborghini S.p.A. Lamborghini and Centenario are trademarks of their respective owners.',
    source: { label: 'Official model page', href: 'https://www.lamborghini.com/en-en/history/few-off/centenario' },
};

export const hero = {
    eyebrow: 'LAMBORGHINI CENTENARIO',
    headline: ['BORN TO', 'BREAK LIMITS.'],
    body: 'Precision engineered. Fearlessly designed. Built to turn every drive into an unforgettable experience. A machine where Italian craftsmanship meets raw performance.',
    cta: { label: 'EXPLORE THE MACHINE', target: 'reveal' },
    tagline: 'V12 POWER · UNCOMPROMISING DESIGN · PURE ADRENALINE',
};

export const reveal = {
    eyebrow: 'DESIGN REVEAL',
    headline: ['EVERY ANGLE.', 'PURE DRAMA.'],
    body: 'Scissor doors swing open on a carbon-fibre body and a cabin built for one purpose.',
};

export const performance = {
    eyebrow: 'ENGINEERED TO THRILL',
    headline: ['POWER IN', 'EVERY PULSE.'],
    body: 'Every revolution tells a story. Every acceleration awakens a force engineered to thrill. Experience the relentless spirit of the Lamborghini Centenario.',
    /** value/decimals drive the count-up; `unit` and `note` are static. */
    specs: [
        { label: 'ENGINE', text: 'V12', note: '6.5 L · 6,498 cm³' },
        { label: 'POWER', value: 770, decimals: 0, unit: 'CV', note: '566 kW @ 8,500 rpm' },
        { label: 'ACCELERATION', value: 2.8, decimals: 1, unit: 's', note: '0–100 km/h' },
    ],
    tach: { max: 9, peak: 8.5, caption: '× 1000 rpm · peak power at 8,500' },
};

export const aero = {
    eyebrow: 'FORM MEETS FUNCTION',
    headline: ['SCULPTED', 'BY THE WIND.'],
    body: 'Nothing is accidental. Every contour, every edge, and every surface reflects a pursuit of aerodynamic precision and unmistakable design.',
    callouts: [
        { id: 'headlight', anchor: 'headlight', label: 'SHARP LIGHT SIGNATURE' },
        { id: 'bodywork', anchor: 'frontWheel', label: 'SCULPTED BODYWORK' },
        { id: 'diffuser', anchor: 'diffuser', label: 'AERODYNAMIC REAR DIFFUSER' },
    ],
};

export const interior = {
    eyebrow: 'BUILT AROUND THE DRIVER',
    headline: ['EVERYTHING.', 'WITHIN YOUR CONTROL.'],
    body: 'Step inside a cockpit designed around the driver. Precision controls, purposeful details, and a focused driving environment put you at the center of every moment.',
    callouts: [
        { id: 'seats', anchor: 'seat', label: 'SEATS' },
        { id: 'steering', anchor: 'steering', label: 'STEERING WHEEL' },
        { id: 'display', anchor: 'display', label: 'DIGITAL DISPLAY' },
    ],
};

export const footer = {
    headline: ['THE DRIVE', 'NEVER ENDS.'],
    body: 'Some machines take you places. Others make every journey unforgettable.',
    brand: 'CENTENARIO',
    brandNote: 'Concept study',
    social: [
        { label: 'Lamborghini on Instagram', short: 'Instagram', href: 'https://www.instagram.com/lamborghini/' },
        { label: 'Lamborghini on YouTube', short: 'YouTube', href: 'https://www.youtube.com/@Lamborghini' },
        { label: 'Lamborghini on X', short: 'X', href: 'https://x.com/Lamborghini' },
    ],
};

/** Order of the six sections; `nav` ones appear in the footer navigation. */
export const sectionNav = [
    { id: 'hero', label: 'HOME' },
    { id: 'reveal', label: 'DESIGN' },
    { id: 'performance', label: 'PERFORMANCE' },
    { id: 'aero', label: 'AERODYNAMICS' },
    { id: 'interior', label: 'INTERIOR' },
];

export const navLinks = sectionNav.map(({ id, label }) => ({ name: label, href: `#${id}` }));
