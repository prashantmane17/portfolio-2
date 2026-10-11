import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { createCarStage } from './car3d';
import { useStory } from './StoryContext';

/**
 * The 3D layer: a transparent WebGL canvas with a darkening veil beneath it (so the scene can
 * fade to black while the tail lights stay lit). Renders only when the scroll state changes,
 * and projects the named anchors onto any `[data-anchor]` callouts.
 */
const CarStage = ({ model, stations }) => {
    const { mode, view, compact } = useStory();
    const glRef = useRef(null);
    const veilRef = useRef(null);

    useEffect(() => {
        const canvas = glRef.current;
        const state = { stage: null, last: '', dirty: true, busy: false, visible: true, dead: false, callouts: [] };

        const draw = (time) => {
            if (!state.stage || !state.visible) return;
            const key = `${view.s}|${view.intro}|${view.paint.hex}|${view.camTarget}`;
            const drifting = mode === 'pinned' && view.s < 0.6; // hero drift needs a frame every tick
            if (key === state.last && !state.dirty && !drifting && !state.busy) return;
            state.last = key;
            state.dirty = false;
            const { fade, busy } = state.stage.update(view, time, { shift: !compact, compact, drift: mode === 'pinned' });
            state.busy = busy;
            veilRef.current.style.opacity = String(fade * 0.9);
            state.callouts.forEach((el) => {
                const p = state.stage.project(el.dataset.anchor);
                if (!p || !p.visible) {
                    el.style.display = 'none';
                    return;
                }
                el.style.display = '';
                el.classList.toggle('is-flipped', p.x > window.innerWidth * 0.55);
                el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
            });
        };

        const resize = () => {
            state.stage?.resize(window.innerWidth, window.innerHeight, compact ? 1.25 : 1.75);
            state.dirty = true;
        };

        createCarStage(canvas, { ...model, stations })
            .then((stage) => {
                if (state.dead) return stage.dispose();
                state.stage = stage;
                state.callouts = Array.from(document.querySelectorAll('[data-anchor]'));
                resize();
                canvas.style.opacity = '1';
                if (mode === 'static') view.intro = 1; // reduced motion: no drive-in
                else gsap.to(view, { intro: 1, duration: 2.2, delay: 0.15, ease: 'power3.out' });
                view.markReady();
            })
            .catch((err) => {
                console.warn('3D car failed to load:', err);
                view.intro = 1;
                view.markReady(); // show the copy anyway
            });

        const tick = (time) => draw(time);
        gsap.ticker.add(tick);
        window.addEventListener('resize', resize);

        // Skip rendering once the stage has scrolled away.
        const io = new IntersectionObserver(([entry]) => (state.visible = entry.isIntersecting));
        io.observe(canvas);

        return () => {
            state.dead = true;
            gsap.killTweensOf(view);
            io.disconnect();
            window.removeEventListener('resize', resize);
            gsap.ticker.remove(tick);
            state.stage?.dispose();
        };
    }, [model, stations, view, compact, mode]);

    return (
        <div className={mode === 'pinned' ? 'absolute inset-0' : 'fixed inset-0'} aria-hidden="true">
            <div ref={veilRef} className="absolute inset-0 bg-dark-900 opacity-0" />
            <canvas ref={glRef} className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-700" />
        </div>
    );
};

export default CarStage;
