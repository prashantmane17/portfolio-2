import React from 'react';
import { useStory } from '../StoryContext';

/**
 * Wrapper for one of the six sections.
 * pinned: stacked over the stage, shown/hidden by the timeline; ignores the pointer except for its
 *         own controls (`pointer-events-auto`). static: an ordinary full-height block.
 * `scrim` adds a gradient behind the copy so it stays legible over the scene.
 */
const SceneFrame = ({ id, titleId, hidden = true, scrim = 'left', align = 'center', children }) => {
    const { mode, compact } = useStory();
    const pinned = mode === 'pinned';

    const scrims = {
        left: 'bg-gradient-to-t lg:bg-gradient-to-r from-dark-900/90 via-dark-900/45 to-transparent',
        bottom: 'bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent',
        none: '',
    };

    return (
        <section
            data-scene={id}
            aria-labelledby={titleId}
            style={pinned && hidden ? { visibility: 'hidden' } : undefined}
            className={
                pinned
                    ? 'absolute inset-0 pointer-events-none'
                    : 'relative min-h-screen'
            }
        >
            <div aria-hidden="true" className={`absolute inset-0 ${scrims[scrim]}`} />
            <div
                className={`relative h-full min-h-screen max-w-7xl mx-auto px-6 lg:px-12 flex flex-col ${
                    align === 'center' ? (compact ? 'justify-end pb-16 pt-24' : 'justify-center') : 'justify-end pb-16'
                }`}
            >
                {children}
            </div>
        </section>
    );
};

export default SceneFrame;
