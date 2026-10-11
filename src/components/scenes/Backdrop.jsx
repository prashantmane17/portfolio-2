import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useScenes } from './context';
import { createCarStage } from './car3d';

const smooth = (t) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
};

/**
 * Stage layer for the car scenes: a transparent WebGL canvas with the 3D car, plus a
 * flat fill in the car's paint colour that takes over as the camera closes on the body.
 *   intro 0..1 (time)   car drives in on load
 *   p     0..1 (scroll) car glides to centre, then the camera zooms into the red panel
 * Props: model = { src, focus, heading, entry }, fill = paint colour.
 */
const Backdrop = ({ model, fill }) => {
    const { mode, drawRef } = useScenes();
    const glRef = useRef(null);
    const fillRef = useRef(null);

    useEffect(() => {
        if (mode !== 'pinned') return;
        const glCanvas = glRef.current;
        const state = { stage: null, view: { p: 0 }, intro: { v: 0 }, time: 0, visible: true, dead: false };

        const draw = (view = state.view) => {
            state.view = view;
            if (!state.stage || !state.visible) return;
            state.stage.update({ p: view.p, intro: state.intro.v }, state.time);
            fillRef.current.style.opacity = smooth((view.p - 0.85) / 0.15);
        };

        const resize = () => {
            state.stage?.resize(window.innerWidth, window.innerHeight);
            draw();
        };

        createCarStage(glCanvas, model)
            .then((stage) => {
                if (state.dead) return stage.dispose();
                state.stage = stage;
                resize();
                glCanvas.style.opacity = '1';
                gsap.to(state.intro, { v: 1, duration: 2.6, delay: 0.2, ease: 'power3.out' });
            })
            .catch((err) => console.warn('3D car failed to load:', err));

        const tick = (time) => {
            state.time = time;
            draw();
        };

        // Skip rendering once the stage has scrolled away.
        const io = new IntersectionObserver(([entry]) => (state.visible = entry.isIntersecting));
        io.observe(glCanvas);

        drawRef.current = draw;
        gsap.ticker.add(tick);
        window.addEventListener('resize', resize);
        return () => {
            state.dead = true;
            gsap.killTweensOf(state.intro);
            io.disconnect();
            window.removeEventListener('resize', resize);
            gsap.ticker.remove(tick);
            state.stage?.dispose();
            drawRef.current = null;
        };
    }, [mode, model, drawRef]);

    if (mode !== 'pinned') return null;
    return (
        <div data-stage-layer className="absolute inset-0">
            <canvas ref={glRef} aria-hidden="true" className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-700" />
            <div ref={fillRef} aria-hidden="true" className="absolute inset-0 opacity-0" style={{ background: fill }} />
        </div>
    );
};

export default Backdrop;
