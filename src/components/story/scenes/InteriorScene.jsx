import React from 'react';
import { interior } from '../../../config/content';
import MaskLines from '../parts/MaskLines';
import Callout from '../parts/Callout';
import SceneFrame from './SceneFrame';
import { useStory } from '../StoryContext';

/** Section 5: through the open door into the cockpit, past the seats to the wheel and display. */
const InteriorScene = () => {
    const { mode } = useStory();
    return (
        <SceneFrame id="interior" titleId="interior-title" scrim="bottom" align="end">
            {mode === 'pinned' && interior.callouts.map((c) => <Callout key={c.id} {...c} />)}
            <div className="max-w-xl">
                <p data-item className="label">
                    {interior.eyebrow}
                </p>
                <MaskLines as="h2" id="interior-title" lines={interior.headline} className="metal-text mt-4 font-bold text-4xl sm:text-5xl lg:text-6xl" />
                <p data-item className="mt-5 text-lg text-gray-300 leading-relaxed">
                    {interior.body}
                </p>
                {mode !== 'pinned' && (
                    <ul className="mt-6 space-y-1 text-sm">
                        {interior.callouts.map((c) => (
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

export default InteriorScene;
