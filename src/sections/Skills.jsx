import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/ui/SectionHeading';
import { skills } from '../data/portfolio';

const Skills = () => {
    return (
        <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading accent="Skills" subtitle="Technologies I've been working with recently">
                    My
                </SectionHeading>

                <div data-scene-item className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {skills.map((skill) => (
                        <motion.div
                            key={skill.name}
                            whileHover={{ scale: 1.05 }}
                            className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center group transition-colors hover:border-primary-500/30"
                        >
                            <h4 className="text-lg font-medium text-gray-100 group-hover:text-primary-400 transition-colors mb-4">
                                {skill.name}
                            </h4>
                            <div className="w-full bg-dark-900/70 rounded-full h-2 overflow-hidden">
                                <div
                                    data-scene-bar
                                    style={{ width: `${skill.level}%` }}
                                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full origin-left"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
