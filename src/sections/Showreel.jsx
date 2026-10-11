import React from 'react';
import { useScenes } from '../components/scenes';
import { showreel } from '../data/portfolio';

/**
 * Pinned: the footage is drawn by the stage canvas (the windshield opens onto it),
 * so this only carries the caption. Stacked: plain full-width video/poster.
 */
const Showreel = () => {
    const { mode } = useScenes();

    if (mode === 'stacked') {
        return (
            <section className="relative w-full bg-dark-900">
                {showreel.src ? (
                    <video className="w-full aspect-video object-cover" src={showreel.src} poster={showreel.poster} muted loop playsInline autoPlay controls />
                ) : (
                    <div className="aspect-video bg-gradient-to-br from-[#2a0d12] to-dark-900 flex items-center justify-center p-6">
                        <img src={showreel.poster} alt="" className="w-full max-w-3xl" />
                    </div>
                )}
                <div className="px-4 py-6">
                    <h2 className="text-2xl font-bold">Built to move</h2>
                    <p className="text-gray-300">A quick look at recent work in motion.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="relative flex-1 flex items-end px-4 sm:px-6 lg:px-8 pb-14 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent">
            <div data-scene-item className="max-w-7xl mx-auto w-full">
                <h2 className="text-3xl md:text-5xl font-bold mb-2">Built to move</h2>
                <p className="text-gray-200 text-lg max-w-md">A quick look at recent work in motion.</p>
            </div>
        </section>
    );
};

export default Showreel;
