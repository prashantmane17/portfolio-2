/**
 * Scroll story: one pinned stage, one timeline measured in "units" (1 unit = `unitVh` of scroll).
 *
 * `stations` are camera/car poses; the car stage interpolates between consecutive stations as the
 * scroll moves through their times. Angles are radians in the car's own frame:
 *   az  0 = camera in front of the car, -π/2 = on the driver-door side, π = behind
 *   el  camera elevation above the target; dist = distance in car lengths
 * `at` names an anchor on the model (see car3d.js) and `off` nudges the target from it.
 * Channels: shift (car sits right of centre), yaw (spin), door (0..1), paint (black -> red),
 * carZ (car drifts forward), fade (scene darkens), tail (tail lights glow).
 */
const TAU = Math.PI * 2;

const base = { at: 'center', off: [0, 0, 0], shift: 0, yaw: 0, door: 0, paint: 0, carZ: 0, fade: 0, tail: 0 };
const s = (t, id, pose) => ({ ...base, ...pose, t, id });

export const stations = [
    s(0.0, 'hero', { az: -1.1, el: 0.13, dist: 1.77, shift: 0.2 }),
    s(0.5, 'hero-hold', { az: -1.1, el: 0.13, dist: 1.77, shift: 0.2 }),
    // 2 · Design reveal: centre, spin one turn, doors up, turn red, then close on the cabin.
    s(1.7, 'reveal-wide', { az: -1.1, el: 0.1, dist: 1.55, yaw: TAU, door: 1, paint: 1 }),
    s(3.0, 'reveal-close', { az: -1.25, el: 0.1, dist: 0.62, at: 'seat', yaw: TAU, door: 1, paint: 1 }),
    // 3 · Performance: doors close, view swings to the front, car drifts forward.
    s(4.2, 'front', { az: -0.6, el: 0.08, dist: 1.6, shift: 0.22, yaw: TAU, paint: 1, carZ: 0.05 }),
    s(5.6, 'front-hold', { az: -0.55, el: 0.08, dist: 1.5, shift: 0.22, yaw: TAU, paint: 1, carZ: 0.15 }),
    // 4 · Aerodynamics: headlight -> front wheel -> side body -> rear diffuser -> wide.
    s(6.5, 'headlight', { az: -0.6, el: 0.04, dist: 0.32, at: 'headlight', yaw: TAU, paint: 1 }),
    s(7.4, 'wheel', { az: -1.5, el: 0.05, dist: 0.5, at: 'frontWheel', yaw: TAU, paint: 1 }),
    s(8.2, 'side', { az: -1.57, el: 0.04, dist: 0.6, off: [0, 0.02, -0.15], yaw: TAU, paint: 1 }),
    s(9.1, 'diffuser', { az: 2.9, el: 0.1, dist: 0.55, at: 'diffuser', yaw: TAU, paint: 1 }),
    s(10.0, 'wide', { az: -0.9, el: 0.14, dist: 1.55, yaw: TAU, paint: 1 }),
    // 5 · Interior: doors up again, into the cockpit, steering wheel, then the display.
    s(11.0, 'cockpit-door', { az: -1.35, el: 0.1, dist: 0.55, at: 'seat', yaw: TAU, paint: 1, door: 1 }),
    s(12.0, 'steering', { az: -2.2, el: 0.13, dist: 0.26, at: 'steering', yaw: TAU, paint: 1, door: 1 }),
    s(12.9, 'display', { az: -2.0, el: 0.15, dist: 0.24, at: 'display', yaw: TAU, paint: 1, door: 1 }),
    // 6 · Footer: doors close, rear three-quarter, scene fades to dark, tail lights stay lit.
    s(14.2, 'rear', { az: 2.65, el: 0.12, dist: 1.35, at: 'tailLight', yaw: TAU, paint: 1, fade: 0.8, tail: 1, shift: 0.24 }),
    s(15.2, 'rear-hold', { az: 2.65, el: 0.12, dist: 1.35, at: 'tailLight', yaw: TAU, paint: 1, fade: 0.8, tail: 1, shift: 0.24 }),
];

/** When each scene's text is on screen (units). `out: null` keeps the scene to the end. */
export const windows = {
    hero: { in: null, out: [0.45, 0.85] },
    reveal: { in: 1.6, out: 3.6 },
    performance: { in: 4.0, out: 6.2 },
    aero: { in: 6.3, out: 10.4 },
    interior: { in: 10.7, out: 13.7 },
    footer: { in: 14.0, out: null },
};

/** Callout label windows [in, out] (units). */
export const calloutWindows = {
    headlight: [6.4, 7.3],
    bodywork: [7.3, 8.9],
    diffuser: [8.9, 9.8],
    seats: [11.1, 12.0],
    steering: [12.0, 12.9],
    display: [12.8, 13.6],
};

/** Tachometer, count-ups and light streaks play across this window (units). */
export const performanceWindow = [4.2, 5.4];

/** Total scroll length in units, and how many viewport-heights of scroll one unit costs. */
export const totalUnits = 15.4;
export const unitVh = { desktop: 70, mobile: 55 };

/** Anchors (also used as in-page links) -> unit at which that section is fully shown. */
export const sectionAt = {
    hero: 0,
    reveal: 1.9,
    performance: 4.4,
    aero: 6.5,
    interior: 11.0,
    footer: 14.4,
};

/** Pinned story from this width up; below it the camera moves are simplified (see StoryRoot). */
export const desktopQuery = '(min-width: 1024px)';
export const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
