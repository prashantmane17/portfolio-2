import React from 'react';
import { Check } from 'lucide-react';

/** Perceived brightness (0..1) of a #rrggbb colour, to pick a readable tick colour. */
const luminance = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};

/**
 * Row of round paint swatches. Each is a real button: labelled for screen readers, `aria-pressed`
 * for the selection, and the selected one also shows a ring and a tick (not colour alone).
 */
const SwatchPicker = ({ colors, selectedId, onSelect }) => (
    <ul className="flex flex-wrap gap-2.5 sm:gap-4" aria-label="Exterior paint colors">
        {colors.map((c) => {
            const selected = c.id === selectedId;
            return (
                <li key={c.id}>
                    <button
                        type="button"
                        data-swatch
                        onClick={() => onSelect(c)}
                        aria-pressed={selected}
                        aria-label={`Select ${c.name} paint`}
                        title={c.name}
                        className={`pointer-events-auto relative grid place-items-center w-11 h-11 rounded-full transition-transform duration-300 ${
                            selected ? 'scale-110 ring-2 ring-white ring-offset-[3px] ring-offset-dark-900' : 'hover:scale-105 ring-1 ring-white/25'
                        }`}
                        style={{ background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.55), transparent 42%), ${c.hex}` }}
                    >
                        <Check
                            size={18}
                            aria-hidden="true"
                            strokeWidth={3}
                            className={`transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0'} ${luminance(c.hex) > 0.55 ? 'text-dark-900' : 'text-white'}`}
                        />
                    </button>
                </li>
            );
        })}
    </ul>
);

export default SwatchPicker;
