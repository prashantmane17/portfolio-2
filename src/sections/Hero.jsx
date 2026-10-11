import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight } from 'lucide-react';
import { useScenes } from '../components/scenes';
import { personalInfo, carImage } from '../data/portfolio';

const Hero = () => {
    const { mode } = useScenes();
    const rise = (delay) => ({
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: delay + 1.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    });

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
                <div className="max-w-xl">
                <motion.div {...rise(0.1)} className="inline-block px-4 py-2 border border-white/15 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                    <p className="text-sm font-medium tracking-wide text-gray-200">{personalInfo.name} &middot; {personalInfo.role}</p>
                </motion.div>

                <motion.h1 {...rise(0.25)} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                    I build websites that <span className="gradient-text">move</span>
                </motion.h1>

                <motion.div {...rise(0.4)} className="text-xl md:text-3xl text-gray-300 font-medium mb-8 h-12">
                    <TypeAnimation
                        sequence={['Scroll-driven animation', 2000, '3D and canvas on the web', 2000, 'Smooth, fast, accessible motion', 2000]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                    />
                </motion.div>

                <motion.p {...rise(0.55)} className="max-w-xl text-lg text-gray-300 mb-10 leading-relaxed">
                    {personalInfo.about}
                </motion.p>

                <motion.div {...rise(0.7)} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <a
                        href="#projects"
                        className="group flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-dark-900 px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-dark-900"
                    >
                        See the work
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                        href="#contact"
                        className="flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/15 transition-all border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                        Start a project
                    </a>
                </motion.div>
                </div>
                {mode === 'stacked' && <img src={carImage.src} alt="" className="w-full max-w-xl mt-10 ml-auto" />}
            </div>
        </section>
    );
};

export default Hero;
