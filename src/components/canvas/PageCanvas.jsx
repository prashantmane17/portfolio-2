import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

const NAVY = '10, 22, 40'; // tailwind dark-900
const GOLD = '212, 162, 76';
const STEEL = '70, 110, 170';
const GRID = 96;

const wrap = (v, size) => ((v % size) + size) % size;

/** Soft light pools that drift on slow orbits and slide with the page scroll. */
const BLOBS = [
    { x: 0.15, y: 0.1, r: 0.6, rgb: GOLD, a: 0.2, par: 0.8, fx: 0.07, fy: 0.05, ax: 0.06, ay: 0.05, ph: 0 },
    { x: 0.85, y: 0.45, r: 0.7, rgb: STEEL, a: 0.3, par: 1.1, fx: 0.05, fy: 0.06, ax: 0.07, ay: 0.06, ph: 2 },
    { x: 0.35, y: 0.85, r: 0.55, rgb: GOLD, a: 0.14, par: 1.4, fx: 0.06, fy: 0.04, ax: 0.05, ay: 0.07, ph: 4 },
    { x: 0.7, y: 1.2, r: 0.65, rgb: STEEL, a: 0.26, par: 1.7, fx: 0.04, fy: 0.07, ax: 0.08, ay: 0.05, ph: 1 },
];

/**
 * One fixed, viewport-sized canvas behind the whole page, drawn in code:
 * navy base, drifting gold/steel light pools, a faint grid and floating dust.
 * Scroll progress of the entire page moves the layers at different speeds
 * (parallax); time adds a slow idle drift. Sections that need to hide it set
 * their own background; everything else stays transparent.
 */
const PageCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const reduce = prefersReducedMotion();
        const state = { p: 0, time: 0 };
        const dust = Array.from({ length: 70 }, () => ({
            x: Math.random(),
            y: Math.random(),
            z: 0.3 + Math.random() * 0.7, // depth: faster scroll parallax when closer
            s: 0.6 + Math.random() * 1.6,
            v: 0.2 + Math.random() * 0.6,
            ph: Math.random() * 6.28,
        }));

        const draw = () => {
            const cw = window.innerWidth;
            const ch = window.innerHeight;
            const { p, time } = state;

            // Base
            const base = ctx.createLinearGradient(0, 0, 0, ch);
            base.addColorStop(0, `rgb(${NAVY})`);
            base.addColorStop(1, 'rgb(6, 14, 28)');
            ctx.globalAlpha = 1;
            ctx.fillStyle = base;
            ctx.fillRect(0, 0, cw, ch);

            // Light pools
            for (const b of BLOBS) {
                const x = (b.x + Math.sin(time * b.fx * 6 + b.ph) * b.ax) * cw;
                const yNorm = wrap(b.y + Math.cos(time * b.fy * 6 + b.ph) * b.ay - p * b.par * 2, 1.6) - 0.3;
                const y = yNorm * ch;
                const r = b.r * Math.max(cw, ch);
                const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, `rgba(${b.rgb}, ${b.a})`);
                g.addColorStop(1, `rgba(${b.rgb}, 0)`);
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, cw, ch);
            }

            // Grid
            ctx.strokeStyle = `rgba(${GOLD}, 0.05)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            const gy = wrap(-p * ch * 2.5, GRID);
            for (let y = gy; y < ch; y += GRID) {
                ctx.moveTo(0, y + 0.5);
                ctx.lineTo(cw, y + 0.5);
            }
            for (let x = 0; x < cw; x += GRID) {
                ctx.moveTo(x + 0.5, 0);
                ctx.lineTo(x + 0.5, ch);
            }
            ctx.stroke();

            // Dust
            ctx.fillStyle = `rgb(${GOLD})`;
            for (const d of dust) {
                const y = wrap(d.y - time * d.v * 0.012 - p * d.z * 2.4, 1) * ch;
                ctx.globalAlpha = (0.25 + 0.25 * Math.sin(time * 0.8 + d.ph)) * d.z;
                ctx.beginPath();
                ctx.arc(d.x * cw, y, d.s * d.z, 0, 6.283);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw();
        };

        const tick = (time) => {
            state.time = time;
            draw();
        };

        const ctxGsap = gsap.context(() => {
            ScrollTrigger.create({
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                onUpdate: (self) => {
                    state.p = self.progress;
                    if (reduce) draw();
                },
            });
        });

        if (!reduce) gsap.ticker.add(tick);
        resize();
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            gsap.ticker.remove(tick);
            ctxGsap.revert();
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 w-full h-full -z-10 pointer-events-none" />;
};

export default PageCanvas;
