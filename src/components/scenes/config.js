/** Tunables for the pinned, canvas-backed scene stack. */
export const SCENES = {
    /** Scroll distance (viewport heights) per timeline unit. */
    unitVh: 100,
    /** Extra scroll (in units) the last scene stays pinned for. */
    tailUnits: 0.5,
    /** Only pin on screens tall/wide enough to fit each scene in one viewport. */
    mediaQuery: '(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)',
    /** Canvas tint, matches tailwind `dark-900`. */
    tint: '20, 10, 46',
    /** The scene (by index) that is revealed *through* the backdrop's focus point. */
    lensSceneIndex: 1,
    /** Timeline unit at which scene `i` is fully shown (also its scroll-anchor position). */
    sceneAt: (i) => (i === 0 ? 0 : 1.3 + (i - 1) * 1.2),
    /** Zoom into the focus point: timeline start / duration. */
    zoom: { at: 0.15, duration: 1.0 },
};
