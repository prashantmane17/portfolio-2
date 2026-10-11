import React from 'react';
import { reveal } from '../../../config/content';
import MaskLines from '../parts/MaskLines';
import SceneFrame from './SceneFrame';

/** Section 2: design reveal. The stage turns the car, lifts the doors and closes on the cabin. */
const RevealScene = () => (
    <SceneFrame id="reveal" titleId="reveal-title" scrim="bottom" align="end">
        <div className="max-w-xl">
            <p data-item className="label">
                {reveal.eyebrow}
            </p>
            <MaskLines as="h2" id="reveal-title" lines={reveal.headline} className="metal-text mt-4 font-bold text-4xl sm:text-5xl lg:text-6xl" />
            <p data-item className="mt-5 text-lg text-gray-300 leading-relaxed">
                {reveal.body}
            </p>
        </div>
    </SceneFrame>
);

export default RevealScene;
