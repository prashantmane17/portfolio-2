import React from 'react';
import SectionHeading from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { skills } from '../data/portfolio';

const Skills = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <section className="py-24 relative bg-dark-800/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading accent="Skills" subtitle="Technologies I've been working with recently">My</SectionHeading>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center group transition-colors hover:border-primary-500/30"
                        >
                            <h4 className="text-lg font-medium text-gray-200 group-hover:text-primary-400 transition-colors mb-4">
                                {skill.name}
                            </h4>

                            <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
