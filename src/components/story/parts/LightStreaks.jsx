import React from 'react';

const STREAKS = [
    { top: '18%', width: '38vw', opacity: 0.35 },
    { top: '42%', width: '55vw', opacity: 0.22 },
    { top: '63%', width: '30vw', opacity: 0.3 },
    { top: '80%', width: '46vw', opacity: 0.18 },
];

/** Restrained red light streaks that sweep across the performance scene (moved by the timeline). */
const LightStreaks = () => (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        {STREAKS.map((s, i) => (
            <span
                key={i}
                data-streak
                className="absolute left-0 h-px -skew-x-[30deg]"
                style={{
                    top: s.top,
                    width: s.width,
                    opacity: s.opacity,
                    background: 'linear-gradient(90deg, transparent, #ff3b3b 50%, transparent)',
                    boxShadow: '0 0 18px 2px rgba(255,59,59,0.45)',
                    transform: 'translateX(-60vw)',
                }}
            />
        ))}
    </div>
);

export default LightStreaks;
