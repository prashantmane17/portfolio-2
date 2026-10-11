import React from 'react';
import Reveal from '../ui/Reveal';
import { useScenes, useSceneIndex } from './context';

/** Fit-to-viewport wrapper so any section can be used as a scene. */
const SCENE_FIT = 'h-full flex flex-col justify-center [&>section]:!py-16 [&>section]:!min-h-0';

/**
 * One screen of content.
 * - pinned: stacked over the canvas, revealed by the Root's scrubbed timeline
 * - stacked: plain section with a one-time scroll reveal
 * `className` styles the scene in both modes; `stackedClassName` only when not pinned
 * (e.g. a static stand-in for the canvas). Mark animatable pieces with `data-scene-item`.
 */
const Scene = ({ id, className = '', stackedClassName = '', children }) => {
    const { mode } = useScenes();
    const index = useSceneIndex();

    if (mode === 'stacked') {
        return (
            <Reveal id={id} className={`${className} ${stackedClassName}`}>
                {children}
            </Reveal>
        );
    }

    return (
        <div
            data-scene
            data-scene-id={id}
            className={`absolute inset-0 ${className}`}
            style={index === 0 ? undefined : { visibility: 'hidden' }}
        >
            <div className={SCENE_FIT}>{children}</div>
        </div>
    );
};

export default Scene;
