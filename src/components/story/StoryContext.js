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

/** Mutable scroll state the car stage reads every frame (s = station index, intro = drive-in 0..1). */
export const createView = () => ({
    s: 1,
    intro: 0,
    reset(next) {
        this.s = next;
    },
});
