import React from 'react';

const R = 96;
const C = 2 * Math.PI * R;
const SWEEP = 0.75 * C; // 270 degrees
const polar = (deg, r) => [120 + r * Math.cos((deg * Math.PI) / 180), 120 + r * Math.sin((deg * Math.PI) / 180)];

/**
 * RPM-inspired gauge. The red arc and the centre readout are animated by the story timeline
 * (`data-tach-arc`, `data-count`); the markup already shows the final state for static use.
 */
const Tachometer = ({ max, peak, caption }) => {
    const frac = peak / max;
    const ticks = Array.from({ length: max + 1 }, (_, n) => n);
    return (
        <figure className="w-56 sm:w-64 lg:w-72" aria-label={`Tachometer: peak power at ${peak * 1000} rpm`}>
            <svg viewBox="0 0 240 240" className="w-full h-auto" role="img" aria-hidden="true">
                <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${SWEEP} ${C}`} transform="rotate(135 120 120)" />
                <circle
                    data-tach-arc
                    data-sweep={SWEEP * frac}
                    data-circ={C}
                    cx="120"
                    cy="120"
                    r={R}
                    fill="none"
                    stroke="#ff3b3b"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${SWEEP * frac} ${C}`}
                    transform="rotate(135 120 120)"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255,59,59,0.7))' }}
                />
                {ticks.map((n) => {
                    const deg = 135 + (270 * n) / max;
                    const [x1, y1] = polar(deg, 78);
                    const [x2, y2] = polar(deg, 86);
                    const [lx, ly] = polar(deg, 66);
                    return (
                        <g key={n}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
                            <text x={lx} y={ly} fill="rgba(255,255,255,0.55)" fontSize="9" textAnchor="middle" dominantBaseline="middle">
                                {n}
                            </text>
                        </g>
                    );
                })}
                <text x="120" y="118" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="700" fontFamily="'Space Grotesk', sans-serif">
                    <tspan data-count={peak} data-decimals="1">{peak.toFixed(1)}</tspan>
                </text>
                <text x="120" y="140" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" letterSpacing="2">
                    × 1000 RPM
                </text>
            </svg>
            <figcaption className="sr-only">{caption}</figcaption>
        </figure>
    );
};

export default Tachometer;
