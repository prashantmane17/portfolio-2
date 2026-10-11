import { createContext, use } from 'react';

/** Shared by every part of <Scenes.Root>. */
export const ScenesContext = createContext(null);
/** Index of the <Scenes.Scene> currently rendering (set by Root). */
export const SceneIndexContext = createContext(0);

export const useScenes = () => {
    const ctx = use(ScenesContext);
    if (!ctx) throw new Error('Scenes parts must be rendered inside <Scenes.Root>');
    return ctx;
};
export const useSceneIndex = () => use(SceneIndexContext);
