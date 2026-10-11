import React, { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useScenes } from './context';
import { SCENES } from './config';

const smooth = (t) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
};
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Full-bleed canvas behind the scenes.
 * - On mount the image opens from the centre until it covers the stage.
 * - `draw(progress)` (0..1) zooms toward `focus` (e.g. the cat's glasses),
 *   gliding it to screen centre, and reports where that focus sits so Root can
 *   reveal the next scene through it.
 *
 * focus  = { x, y, w, h } zoom target; lenses = [{ x, y, w, h }] windows revealing the next scene.
 * All values are fractions of the image.
 */
const Backdrop = ({ src, focus }) => {
    const { mode, drawRef, lensRef } = useScenes();
    const canvasRef = useRef(null);

    useEffect(() => {
        if (mode !== 'pinned') return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const state = { img: null, p: 0, open: prefersReducedMotion() ? 1 : 0, w: 0, h: 0 };

        const draw = (p = state.p) => {
            state.p = p;
            const { w: cw, h: ch, img } = state;
            if (!cw) return;
            ctx.globalAlpha = 1;
            ctx.fillStyle = `rgb(${SCENES.tint})`;
            ctx.fillRect(0, 0, cw, ch);
            if (!img) return;

            const cover = Math.max(cw / img.width, ch / img.height);
            const W0 = img.width * cover;
            const H0 = img.height * cover;
            const zoomMax = (1.25 * cw) / (focus.w * W0);
            const s = Math.exp(Math.log(zoomMax) * p) * (1 + 0.35 * (1 - state.open));
            const W = W0 * s;
            const H = H0 * s;

            // Focus point: natural position -> screen centre as p goes 0 -> 1.
            const fx0 = (cw - W0) / 2 + focus.x * W0;
            const fy0 = (ch - H0) / 2 + focus.y * H0;
            const px = lerp(fx0, cw / 2, p);
            const py = lerp(fy0, ch / 2, p);

            ctx.save();
            ctx.beginPath();
            ctx.rect((cw - cw * state.open) / 2, (ch - ch * state.open) / 2, cw * state.open, ch * state.open);
            ctx.clip();
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, px - focus.x * W, py - focus.y * H, W, H);
            const veil = ctx.createLinearGradient(0, 0, 0, ch);
            veil.addColorStop(0, `rgba(${SCENES.tint}, 0.35)`);
            veil.addColorStop(1, `rgba(${SCENES.tint}, 0.7)`);
            ctx.fillStyle = veil;
            ctx.fillRect(0, 0, cw, ch);
            ctx.restore();

            // Lenses: each opens at its on-screen size, then swells until the pair covers the stage.
            const gate = smooth((p - 0.2) / 0.3);
            const expand = smooth((p - 0.72) / 0.28);
            lensRef.current?.({
                done: p >= 0.999,
                lenses: focus.lenses.map((l) => ({
                    x: px + (l.x - focus.x) * W,
                    y: py + (l.y - focus.y) * H,
                    rx: lerp(l.w * W * 0.5 * 1.05, cw * 0.9, expand) * gate,
                    ry: lerp(l.h * H * 0.5 * 1.05, ch * 0.9, expand) * gate,
                })),
            });
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            state.w = window.innerWidth;
            state.h = window.innerHeight;
            canvas.width = state.w * dpr;
            canvas.height = state.h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw();
        };

        const img = new Image();
        img.onload = () => {
            state.img = img;
            draw();
            if (state.open < 1) {
                gsap.to(state, { open: 1, duration: 1.8, delay: 0.15, ease: 'power4.inOut', onUpdate: () => draw() });
            }
        };
        img.src = src;

        drawRef.current = draw;
        resize();
        window.addEventListener('resize', resize);
        return () => {
            gsap.killTweensOf(state);
            window.removeEventListener('resize', resize);
            drawRef.current = null;
        };
    }, [mode, src, focus, drawRef, lensRef]);

    if (mode !== 'pinned') return null;
    return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />;
};

export default Backdrop;
