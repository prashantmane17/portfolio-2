import React, { useRef, useState } from 'react';
import { customizer } from '../../../config/content';
import MaskLines from '../parts/MaskLines';
import SwatchPicker from '../parts/SwatchPicker';
import SceneFrame from './SceneFrame';
import { useStory } from '../StoryContext';

/**
 * Section 6: choose the paint. The same 3D car as the rest of the story is repainted live (see
 * car3d.js); the visitor can also drag, use the arrow keys, or press FRONT / SIDE / REAR.
 */
const CustomizerScene = () => {
    const { mode, view, compact } = useStory();
    const interactive = mode === 'pinned';
    const [selected, setSelected] = useState(() => customizer.colors.find((c) => c.id === customizer.defaultId) ?? customizer.colors[0]);
    const [activeView, setActiveView] = useState(null);
    const drag = useRef({ x: 0 });

    const choose = (color) => {
        setSelected(color);
        view.setPaint({ original: Boolean(color.original), hex: color.hex, metalness: color.metalness, roughness: color.roughness });
    };
    const chooseView = (v) => {
        setActiveView(v.id);
        view.setCam(v.delta);
    };

    const onPointerDown = (e) => {
        drag.current.x = e.clientX;
        view.setDragging(true);
        setActiveView(null);
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
        if (!view.dragging) return;
        view.dragBy((e.clientX - drag.current.x) * 0.008);
        drag.current.x = e.clientX;
    };
    const stopDrag = () => view.setDragging(false);
    const onKeyDown = (e) => {
        if (e.key === 'ArrowLeft') view.dragBy(-0.12);
        if (e.key === 'ArrowRight') view.dragBy(0.12);
    };

    return (
        <SceneFrame id="customizer" titleId="customizer-title" scrim="left" align="end">
            {interactive && (
                // Drag surface over the car (viewport coordinates, so it ignores the centred layout).
                <div
                    role="group"
                    tabIndex={0}
                    aria-label="Interactive 3D car. Drag, or use the left and right arrow keys, to rotate."
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={stopDrag}
                    onPointerCancel={stopDrag}
                    onKeyDown={onKeyDown}
                    className={`pointer-events-auto fixed cursor-grab active:cursor-grabbing ${
                        compact ? 'left-0 top-0 w-full h-[46vh]' : 'right-0 top-0 h-screen w-[58%]'
                    }`}
                    style={{ touchAction: 'pan-y' }}
                />
            )}

            <div className="max-w-xl">
                <p data-item className="label">
                    {customizer.eyebrow}
                </p>
                <MaskLines as="h2" id="customizer-title" lines={customizer.headline} className="metal-text mt-3 font-bold text-3xl sm:text-5xl lg:text-6xl" />
                <p data-item className="mt-3 text-base sm:text-lg text-gray-300 leading-relaxed">
                    {customizer.body}
                </p>

                <div data-item className="mt-5 sm:mt-6">
                    <p id="swatch-label" className="label !text-gray-400">
                        {customizer.label}
                    </p>
                    <div className="mt-3">
                        <SwatchPicker colors={customizer.colors} selectedId={selected.id} onSelect={choose} />
                    </div>
                    <div className="mt-3 sm:mt-4" aria-live="polite">
                        <p className="font-heading font-bold text-xl text-white">{selected.name}</p>
                        <p className="text-sm text-gray-400">{selected.finish}</p>
                    </div>
                </div>

                {interactive && (
                    <div data-item className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <div role="group" aria-label="Camera view" className="flex gap-2">
                            {customizer.views.map((v) => (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => chooseView(v)}
                                    aria-pressed={activeView === v.id}
                                    className={`pointer-events-auto label !text-white px-4 py-2 rounded-full border transition-colors ${
                                        activeView === v.id ? 'border-white bg-white/15' : 'border-white/25 hover:border-white/60'
                                    }`}
                                >
                                    {v.label}
                                </button>
                            ))}
                        </div>
                        <span className="label !text-gray-500 hidden sm:inline">{customizer.dragHint}</span>
                    </div>
                )}

                <p data-item className="mt-4 text-xs text-gray-500 max-w-md">
                    {customizer.note}
                </p>
            </div>
        </SceneFrame>
    );
};

export default CustomizerScene;
