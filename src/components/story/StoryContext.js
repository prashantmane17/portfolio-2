import { createContext, use } from 'react';

/**
 * Shared by the story's parts.
 *  mode  'pinned' (scroll-scrubbed stage) | 'static' (reduced motion: plain stack, car held still)
 *  view  mutable scroll state read by the car stage each frame: { s, intro }
 *  goTo  (sectionId) => smooth-scroll to that section
 *  compact  true on narrow screens (simplified camera, shorter scroll)
 */
export const StoryContext = createContext(null);

export const useStory = () => {
    const ctx = use(StoryContext);
    if (!ctx) throw new Error('Story parts must be rendered inside <StoryRoot>');
    return ctx;
};

/**
 * Mutable state the car stage reads every frame.
 *  s, intro       station index (scroll) and the drive-in progress (0..1)
 *  paint          selected finish { original, hex, metalness, roughness } (config/content.js customizer);
 *                 `original` keeps the model's own black carbon. Starts original, so nothing changes until chosen.
 *  yawOffset...   the visitor's drag / auto-rotation of the car (used while `interact` > 0)
 *  camTarget      extra camera azimuth for the FRONT / SIDE / REAR buttons
 * Mutate through the methods (they also keep React happy about not editing state directly).
 */
export const createView = () => ({
    s: 1,
    intro: 0,
    paint: { original: true, hex: '#151515', metalness: 0.4, roughness: 0.2 },
    yawOffset: 0,
    velocity: 0,
    dragging: false,
    autoSpin: 0.22,
    camTarget: 0,
    camDelta: 0,
    ready: false, // the 3D stage has loaded (or failed): the hero copy waits for this
    readyCbs: [],
    onReady(cb) {
        if (this.ready) cb();
        else this.readyCbs.push(cb);
        return () => (this.readyCbs = this.readyCbs.filter((f) => f !== cb));
    },
    markReady() {
        if (this.ready) return;
        this.ready = true;
        this.readyCbs.splice(0).forEach((f) => f());
    },
    reset(next) {
        this.s = next;
    },
    setPaint(next) {
        this.paint = next;
    },
    setAutoSpin(v) {
        this.autoSpin = v;
    },
    setDragging(on) {
        this.dragging = on;
    },
    dragBy(dx) {
        this.yawOffset += dx;
        this.velocity = dx * 0.6;
    },
    setCam(delta) {
        this.camTarget = delta;
        this.yawOffset = 0;
        this.velocity = 0;
    },
});
