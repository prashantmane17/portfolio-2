import React from 'react';
import { showreel } from '../data/portfolio';

/** Full-width footage. Shows the poster/car image until `showreel.src` is set. */
const Showreel = () => (
    <section className="relative w-full">
        {showreel.src ? (
            <video className="w-full aspect-video object-cover" src={showreel.src} poster={showreel.poster} muted loop playsInline autoPlay controls />
        ) : (
            <div className="aspect-video bg-gradient-to-br from-[#2a0d12] to-dark-900 flex items-center justify-center p-6">
                <img src={showreel.poster} alt="" className="w-full max-w-4xl" />
            </div>
        )}
        <div data-scene-item className="absolute bottom-0 left-0 p-6 sm:p-10 bg-gradient-to-t from-dark-900/80 to-transparent w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-1">Built to move</h2>
            <p className="text-gray-200 text-lg">A quick look at recent work in motion.</p>
        </div>
    </section>
);

export default Showreel;
