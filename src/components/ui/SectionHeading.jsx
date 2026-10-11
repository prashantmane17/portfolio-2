import React from 'react';

/** Section title with gradient accent word and underline bar. Revealed by <Reveal>/<Scenes.Scene>. */
const SectionHeading = ({ children, accent, subtitle }) => (
    <div data-scene-item className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {children} <span className="gradient-text">{accent}</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
        {subtitle && <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">{subtitle}</p>}
    </div>
);

export default SectionHeading;
