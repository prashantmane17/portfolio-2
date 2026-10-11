import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useScenes } from './context';
import { createCarStage } from './car3d';
import { createFootage } from './footage';

/**
 * Stage layers for the car scenes: a WebGL canvas (3D car) with a 2D canvas on top
 * (the footage seen through the windshield). Scroll-driven `view`:
 *   drive 0..1 car drives out right and back in from the left   p 0..1  camera pushes into the windshield
 *   e    0..1  windshield opens onto the full-width footage
 * Props: model = { src, windshield, heading, travel }, showreel = { src, poster }, car = fallback PNG.
 */
const Backdrop = ({ model, showreel, car }) => {
    const { mode, drawRef } = useScenes();
    const glRef = useRef(null);
    const footageRef = useRef(null);

    useEffect(() => {
        if (mode !== 'pinned') return;
        const glCanvas = glRef.current;
        const fCanvas = footageRef.current;
        const fctx = fCanvas.getContext('2d');
        const footage = createFootage({ showreel, car });
        const state = { stage: null, view: { drive: 0, p: 0, e: 0 }, time: 0, cw: 0, ch: 0, visible: true, dead: false };

        const draw = (view = state.view) => {
            state.view = view;
            if (!state.stage || !state.cw || !state.visible) return;
            const anchor = state.stage.update(view, state.time);
            footage.draw(fctx, state.cw, state.ch, anchor, view.e, state.time);
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            state.cw = window.innerWidth;
            state.ch = window.innerHeight;
            fCanvas.width = state.cw * dpr;
            fCanvas.height = state.ch * dpr;
            fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            state.stage?.resize(state.cw, state.ch);
            draw();
        };

        createCarStage(glCanvas, model)
            .then((stage) => {
                if (state.dead) return stage.dispose();
                state.stage = stage;
                resize();
                glCanvas.style.opacity = '1';
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
        resize();
        window.addEventListener('resize', resize);
        return () => {
            state.dead = true;
            io.disconnect();
            window.removeEventListener('resize', resize);
            gsap.ticker.remove(tick);
            footage.dispose();
            state.stage?.dispose();
            drawRef.current = null;
        };
    }, [mode, model, showreel, car, drawRef]);

    if (mode !== 'pinned') return null;
    return (
        <>
            <div data-stage-layer className="absolute inset-0">
                <canvas ref={glRef} aria-hidden="true" className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-700" />
                <canvas ref={footageRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />
            </div>
        </>
    );
};

export default Backdrop;
