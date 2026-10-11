import React from 'react';

/** Headline whose lines rise through a mask (animated via `[data-line]` by the story timeline). */
const MaskLines = ({ as = 'h2', lines, id, className = '' }) =>
    React.createElement(
        as,
        { id, className },
        lines.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span data-line className="block">
                    {line}
                </span>
            </span>
        ))
    );

export default MaskLines;
