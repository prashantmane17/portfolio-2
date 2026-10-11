/** Tunables for the pinned scene stack. */
export const SCENES = {
    /** Scroll distance (viewport heights) per timeline unit. */
    unitVh: 100,
    /** Extra scroll (in units) the last scene stays pinned for. */
    tailUnits: 0.5,
    /** Only pin on screens tall/wide enough to fit each scene in one viewport. */
    mediaQuery: '(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)',
    /** Timeline unit at which scene `i` is fully shown (also its scroll-anchor position). */
    sceneAt: (i) => (i === 0 ? 0 : 1.9 + (i - 1) * 1.3),
    /** Timeline units a `slide` (rises over) scene takes to arrive. */
    slide: 1,
    /** Scroll: car glides to centre and the camera zooms into its red body (timeline units). */
    zoom: { at: 0, duration: 1.6 },
};
