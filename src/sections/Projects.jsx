import React from 'react';
import SectionHeading from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { ExternalLink, FileText } from 'lucide-react';
import { projects } from '../data/portfolio';

const Projects = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading accent="Motion Work">Selected</SectionHeading>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card rounded-2xl overflow-hidden group border border-white/5 hover:border-primary-500/30 transition-colors"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <div className="absolute inset-0 bg-dark-900/40 z-10 group-hover:bg-transparent transition-colors duration-500" />
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                />
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 mb-6 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.tech.map((tech, techIndex) => (
                                        <span
                                            key={techIndex}
                                            className="px-3 py-1 text-xs font-medium text-primary-300 bg-primary-500/10 rounded-full border border-primary-500/20"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/5"
                                    >
                                        <ExternalLink size={16} /> Live Demo
                                    </a>
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                    >
                                        <FileText size={16} /> Case study
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
