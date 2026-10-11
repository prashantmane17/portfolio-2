/** Tunables for the pinned scene stack. */
export const SCENES = {
    /** Scroll distance (viewport heights) per timeline unit. */
    unitVh: 100,
    /** Extra scroll (in units) the last scene stays pinned for. */
    tailUnits: 0.5,
    /** Only pin on screens tall/wide enough to fit each scene in one viewport. */
    mediaQuery: '(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)',
    /** Timeline unit at which scene `i` is fully shown (also its scroll-anchor position). */
    sceneAt: (i) => (i === 0 ? 0 : 2.7 + (i - 1) * 1.2),
    /** Timeline units a `slide` (rises over) or `push` (enters from the left) scene takes to arrive. */
    slide: 1,
    /** Car drives along the track, camera pushes into the windshield, windshield opens onto the footage. */
    drive: { at: 0, duration: 1.4 },
    dolly: { at: 1.4, duration: 0.6 },
    reveal: { at: 2.0, duration: 0.5 },
};
