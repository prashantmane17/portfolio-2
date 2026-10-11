import React from 'react';
import { motion } from 'framer-motion';

/** Animated section title with gradient accent word and underline bar. */
const SectionHeading = ({ children, accent, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
    >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {children} <span className="gradient-text">{accent}</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
        {subtitle && <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">{subtitle}</p>}
    </motion.div>
);

export default SectionHeading;
