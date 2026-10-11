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

export const customizer = {
    eyebrow: 'PERSONALIZE YOUR MACHINE',
    headline: ['MAKE IT', 'YOURS.'],
    body: 'Every shade tells a story. Choose the finish that reflects your personality.',
    label: 'CHOOSE YOUR COLOR',
    /** The car starts in its original black carbon; nothing is repainted until a swatch is chosen. */
    defaultId: 'nero',
    dragHint: 'DRAG TO ROTATE',
    note: 'Colors are illustrative starting points, not factory paint specifications.',
    views: [
        { id: 'front', label: 'FRONT', delta: 0.9 },
        { id: 'side', label: 'SIDE', delta: -0.67 },
        { id: 'rear', label: 'REAR', delta: 3.5 },
    ],
    /** hex = starting colour; metalness/roughness shape the finish; `original` = keep the model's own carbon. */
    colors: [
        { id: 'rosso', name: 'Rosso Red', hex: '#C8102E', finish: 'Deep gloss with a warm metallic flake.', metalness: 0.5, roughness: 0.28 },
        { id: 'pearl', name: 'Pearl White', hex: '#F2F2F2', finish: 'Soft pearlescent white with a satin glow.', metalness: 0.3, roughness: 0.3 },
        { id: 'nero', name: 'Nero Black', hex: '#151515', original: true, finish: 'The original black carbon-fibre finish.', metalness: 0.4, roughness: 0.2 },
        { id: 'silver', name: 'Metallic Silver', hex: '#B7BBC2', finish: 'Fine metallic flake with a cool, brushed shine.', metalness: 0.85, roughness: 0.32 },
        { id: 'emerald', name: 'Emerald Green', hex: '#153D32', finish: 'Dark metallic green that lifts in direct light.', metalness: 0.55, roughness: 0.28 },
        { id: 'blue', name: 'Electric Blue', hex: '#173F73', finish: 'Vivid metallic blue with a glassy depth.', metalness: 0.55, roughness: 0.26 },
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
    { id: 'customizer', label: 'COLOR' },
];

export const navLinks = sectionNav.map(({ id, label }) => ({ name: label, href: `#${id}` }));
