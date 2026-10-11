import React from 'react';
import { aero } from '../../../config/content';
import MaskLines from '../parts/MaskLines';
import Callout from '../parts/Callout';
import SceneFrame from './SceneFrame';
import { useStory } from '../StoryContext';

/** Section 4: the camera tours headlight, wheel and bodywork, then the rear diffuser. */
const AeroScene = () => {
    const { mode } = useStory();
    return (
        <SceneFrame id="aero" titleId="aero-title" scrim="bottom" align="end">
            {mode === 'pinned' && aero.callouts.map((c) => <Callout key={c.id} {...c} />)}
            <div className="max-w-xl">
                <p data-item className="label">
                    {aero.eyebrow}
                </p>
                <MaskLines as="h2" id="aero-title" lines={aero.headline} className="metal-text mt-4 font-bold text-4xl sm:text-5xl lg:text-6xl" />
                <p data-item className="mt-5 text-lg text-gray-300 leading-relaxed">
                    {aero.body}
                </p>
                {mode !== 'pinned' && (
                    <ul className="mt-6 space-y-1 text-sm text-gray-300">
                        {aero.callouts.map((c) => (
                            <li key={c.id} className="label !text-white">
                                {c.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </SceneFrame>
    );
};

export default AeroScene;
