import { stations, windows, calloutWindows, performanceWindow } from '../../config/story';

const asRange = (v, length = 0.3) => (Array.isArray(v) ? v : [v, v + length]);

/**
 * Builds the single scrubbed story timeline (units, see config/story.js) on `tl`:
 *  - the camera/car station index (`view.s`), eased station to station
 *  - each scene's copy: scene fade, masked headline lines, staggered items
 *  - the tachometer arc, count-up figures and light streaks
 *  - callout labels
 * Everything is a function of scroll position, so reverse scrolling replays it backwards.
 */
export function buildStoryTimeline(tl, root, view) {
    // Camera + car.
    for (let k = 0; k < stations.length - 1; k++) {
        const from = stations[k];
        const to = stations[k + 1];
        tl.to(view, { s: k + 1, duration: to.t - from.t, ease: 'power2.inOut' }, from.t);
    }

    // Scene copy.
    for (const [id, win] of Object.entries(windows)) {
        const scene = root.querySelector(`[data-scene="${id}"]`);
        if (!scene) continue;
        const lines = scene.querySelectorAll('[data-line]');
        const items = scene.querySelectorAll('[data-item]');

        if (win.in != null) {
            tl.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, win.in);
            if (lines.length) tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1 }, win.in);
            if (items.length) tl.fromTo(items, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out', stagger: 0.1 }, win.in + 0.25);
        }
        if (win.out != null) {
            const [a, b] = asRange(win.out, 0.3);
            tl.to(scene, { autoAlpha: 0, duration: b - a }, a);
        }
    }

    // Performance: tachometer sweep, count-ups, light streaks.
    const [p0, p1] = performanceWindow;
    root.querySelectorAll('[data-tach-arc]').forEach((arc) => {
        const sweep = Number(arc.dataset.sweep);
        const circ = Number(arc.dataset.circ);
        const dash = { v: 0 };
        tl.fromTo(
            dash,
            { v: 0 },
            { v: sweep, duration: p1 - p0, ease: 'power2.out', onUpdate: () => arc.setAttribute('stroke-dasharray', `${dash.v} ${circ}`) },
            p0
        );
        arc.setAttribute('stroke-dasharray', `0 ${circ}`);
    });
    root.querySelectorAll('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals || 0);
        const counter = { v: 0 };
        el.textContent = (0).toFixed(decimals);
        tl.fromTo(counter, { v: 0 }, { v: target, duration: p1 - p0, ease: 'power2.out', onUpdate: () => (el.textContent = counter.v.toFixed(decimals)) }, p0);
    });
    const streaks = root.querySelectorAll('[data-streak]');
    streaks.forEach((el, i) => {
        tl.fromTo(el, { x: '-60vw' }, { x: '140vw', duration: 1.6 + i * 0.25, ease: 'none' }, windows.performance.in + i * 0.15);
    });

    // Customizer: swatches enter one after another.
    const swatches = root.querySelectorAll('[data-swatch]');
    if (swatches.length) {
        tl.fromTo(swatches, { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(1.6)', stagger: 0.07 }, windows.customizer.in + 0.4);
    }

    // Callouts.
    for (const [id, [a, b]] of Object.entries(calloutWindows)) {
        const el = root.querySelector(`[data-callout="${id}"]`);
        if (!el) continue;
        tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, a);
        tl.to(el, { autoAlpha: 0, duration: 0.25 }, b - 0.25);
    }

    // Make sure the timeline spans the whole scroll even if the last tween ends earlier.
    return tl;
}
