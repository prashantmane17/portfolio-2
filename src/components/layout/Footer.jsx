import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';

const Footer = () => {
    return (
        <footer className="bg-dark-900 border-t border-white/5 py-12 text-center text-gray-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-white mb-6">Prashant Mane</h2>
                <div className="flex space-x-6 mb-8">
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                        <Github size={24} />
                    </a>
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                        <Linkedin size={24} />
                    </a>
                    <a href={`mailto:${personalInfo.email}`} className="hover:text-primary-400 transition-colors">
                        <Mail size={24} />
                    </a>
                </div>
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Prashant Mane. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
