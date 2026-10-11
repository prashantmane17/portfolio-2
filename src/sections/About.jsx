import React from 'react';
import { Code2, LayoutTemplate, Briefcase } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import { personalInfo } from '../data/portfolio';

const About = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading accent="Me">About</SectionHeading>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div data-scene-item className="space-y-6">
                        <h3 className="text-2xl font-semibold text-white">
                            Professional <span className="text-primary-400">Introduction</span>
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed">{personalInfo.about}</p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            I thrive on transforming complex problems into elegant, user-centric solutions.
                            My expertise lies in integrating modern React frameworks with powerful e-commerce
                            platforms like Shopify, ensuring businesses succeed in the digital space.
                        </p>
                    </div>

                    <div data-scene-item className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="glass-card p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 text-primary-400">
                                <Briefcase size={24} />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">Experience</h4>
                            <p className="text-gray-300">{personalInfo.experience} Developer</p>
                        </div>

                        <div className="glass-card p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center mb-4 text-accent-400">
                                <Code2 size={24} />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">React JS</h4>
                            <p className="text-gray-300">Modern single-page applications</p>
                        </div>

                        <div className="glass-card p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300 sm:col-span-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl flex items-center justify-center mb-4 text-white">
                                <LayoutTemplate size={24} />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">Shopify Themes</h4>
                            <p className="text-gray-300">Custom, high-converting e-commerce experiences using Liquid and React.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
