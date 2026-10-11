import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Download } from 'lucide-react';
import { personalInfo } from '../data/portfolio';

const Hero = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
            {/* Background ambient light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm mb-6"
                    >
                        <p className="text-sm font-medium tracking-wide text-gray-300">
                            Welcome to my portfolio
                        </p>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        Hi, I'm <span className="gradient-text">{personalInfo.name}</span>
                    </h1>

                    <div className="text-xl md:text-3xl text-gray-400 font-medium mb-8 h-12">
                        <TypeAnimation
                            sequence={[
                                'Shopify Theme Developer',
                                2000,
                                'React JS Specialist',
                                2000,
                                'Frontend Engineer',
                                2000,
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                        />
                    </div>

                    <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
                        {personalInfo.about}
                    </p>

                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <a
                            href="#projects"
                            className="group flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-dark-900"
                        >
                            View Projects
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>

                        <a
                            href="#contact"
                            className="flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/15 transition-all border border-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            Contact Me
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <AnimatePresence>
                {scrollY <= 50 && (
                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        transition={{ delay: 1, duration: 1 }}
                    >
                        <span className="text-xs uppercase tracking-wider font-semibold">Scroll</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-1 h-8 rounded-full bg-gradient-to-b from-gray-500 to-transparent"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Hero;
