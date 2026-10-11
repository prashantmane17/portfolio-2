import React from 'react';

/** One headline specification: caption, big figure (counted up on scroll when numeric), small note. */
const SpecBlock = ({ label, text, value, decimals = 0, unit, note }) => (
    <div data-item className="border-t border-white/20 pt-4">
        <p className="label !text-gray-400 !text-[10px] sm:!text-xs !tracking-[0.14em] sm:!tracking-label">{label}</p>
        <p className="mt-2 font-heading font-bold text-4xl sm:text-5xl text-white leading-none">
            {value != null ? (
                <>
                    <span data-count={value} data-decimals={decimals}>
                        {value.toFixed(decimals)}
                    </span>
                    <span className="ml-2 text-lg sm:text-xl text-primary-400 font-semibold">{unit}</span>
                </>
            ) : (
                text
            )}
        </p>
        <p className="mt-2 text-sm text-gray-400">{note}</p>
    </div>
);

export default SpecBlock;
