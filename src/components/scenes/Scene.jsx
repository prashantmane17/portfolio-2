import React from 'react';
import Reveal from '../ui/Reveal';
import { useScenes, useSceneIndex } from './context';

/** Fit-to-viewport wrapper so any section can be used as a scene. */
const SCENE_FIT = 'h-full flex flex-col justify-center [&>section]:!py-16 [&>section]:!min-h-0';

/**
 * One screen of content.
 * - pinned: stacked over the canvas, revealed by the Root's scrubbed timeline
 * - stacked: plain section with a one-time scroll reveal
 * `transition`: 'slide' rises over the previous scene, 'push' enters from the left pushing it out,
 * 'zoom' is driven by <Scenes.Backdrop>.
 * `className` styles the scene (e.g. an opaque background). Mark animatable pieces with `data-scene-item`.
 */
/** Edge shadow for scenes that arrive over/against another one. */
const SHADOW = {
    slide: 'shadow-[0_-30px_60px_rgba(3,8,20,0.6)]',
    push: 'shadow-[30px_0_60px_rgba(3,8,20,0.6)]',
};

const Scene = ({ id, transition = 'slide', className = '', children }) => {
    const { mode } = useScenes();
    const index = useSceneIndex();

    if (mode === 'stacked') {
        return (
            <Reveal id={id} className={className}>
                {children}
            </Reveal>
        );
    }

    return (
        <div
            data-scene
            data-scene-id={id}
            data-scene-transition={transition}
            className={`absolute inset-0 ${SHADOW[transition] ?? ''} ${className}`}
        >
            <div className={SCENE_FIT}>{children}</div>
        </div>
    );
};

export default Scene;
