import React from 'react';

/**
 * Short label pinned to a point on the 3D model. It is `fixed` so its coordinates are viewport
 * coordinates (it sits inside a centred container); the car stage moves it to the anchor's screen
 * position every frame and the story timeline fades it in and out (`data-callout`).
 */
const Callout = ({ id, anchor, label }) => (
    <div data-anchor={anchor} data-callout={id} className="callout fixed left-0 top-0 pointer-events-none" style={{ visibility: 'hidden' }}>
        <div className="callout-row flex items-center -translate-y-1/2">
            <span className="callout-dot w-2.5 h-2.5 -ml-[5px] rounded-full bg-primary-400 ring-4 ring-primary-400/30 shrink-0" />
            <span className="h-px w-8 sm:w-14 bg-white/50 shrink-0" />
            <span className="label !text-white !text-[10px] sm:!text-xs leading-tight bg-dark-900/75 backdrop-blur-sm px-3 py-1.5 border border-white/10 max-w-[9rem] sm:max-w-none whitespace-normal sm:whitespace-nowrap">{label}</span>
        </div>
    </div>
);

export default Callout;
