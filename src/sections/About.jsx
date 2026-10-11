import React from 'react';
import { Layers, Box, Gauge } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import { personalInfo } from '../data/portfolio';

const About = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading accent="Motion">How I Use</SectionHeading>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div data-scene-item className="space-y-6">
                        <h3 className="text-2xl font-semibold text-white">
                            Animation that <span className="text-primary-400">earns its place</span>
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed">{personalInfo.about}</p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Every effect on this page is driven by scroll: the car you just watched turn, open and
                            change colour is a live 3D model, and the transitions are scrubbed to your wheel.
                            I plan motion the way a director plans a cut, then build it so it stays smooth on real devices.
                        </p>
                    </div>

                    <div data-scene-item className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="glass-card p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 text-primary-400">
                                <Layers size={24} />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">Scroll-driven scenes</h4>
                            <p className="text-gray-300">Pinned sections and timelines that follow the scrollbar, frame by frame.</p>
                        </div>

                        <div className="glass-card p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center mb-4 text-accent-400">
                                <Box size={24} />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">3D and canvas</h4>
                            <p className="text-gray-300">Real-time models, lighting and particles, right in the browser.</p>
                        </div>

                        <div className="glass-card p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300 sm:col-span-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl flex items-center justify-center mb-4 text-white">
                                <Gauge size={24} />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">Smooth by default</h4>
                            <p className="text-gray-300">Lenis smooth scrolling, a steady 60fps, and reduced-motion respected, so the experience stays fast and accessible.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
