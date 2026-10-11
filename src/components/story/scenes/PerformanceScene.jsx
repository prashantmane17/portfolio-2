import React from 'react';
import { performance } from '../../../config/content';
import MaskLines from '../parts/MaskLines';
import Tachometer from '../parts/Tachometer';
import SpecBlock from '../parts/SpecBlock';
import LightStreaks from '../parts/LightStreaks';
import SceneFrame from './SceneFrame';
import { useStory } from '../StoryContext';

/** Section 3: copy, a tachometer that sweeps up to peak power, and three count-up specifications. */
const PerformanceScene = () => {
    const { mode, compact } = useStory();
    return (
        <SceneFrame id="performance" titleId="performance-title" scrim="left" align="end">
            {mode === 'pinned' && <LightStreaks />}
            {!compact && (
                <div data-item className="absolute top-24 left-6 lg:left-12">
                    <Tachometer {...performance.tach} />
                </div>
            )}
            <div className="relative">
                <div className="max-w-xl">
                    <p data-item className="label">
                        {performance.eyebrow}
                    </p>
                    <MaskLines as="h2" id="performance-title" lines={performance.headline} className="metal-text mt-4 font-bold text-4xl sm:text-5xl lg:text-6xl" />
                    <p data-item className="mt-5 text-lg text-gray-300 leading-relaxed">
                        {performance.body}
                    </p>
                </div>
            </div>
            <div className="relative mt-8 grid grid-cols-3 gap-4 sm:gap-8 lg:max-w-2xl">
                {performance.specs.map((spec) => (
                    <SpecBlock key={spec.label} {...spec} />
                ))}
            </div>
        </SceneFrame>
    );
};

export default PerformanceScene;
