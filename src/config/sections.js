import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

/**
 * Single source of truth for page sections, in render order.
 * - `label`: text used by the navbar
 * To add a section: create it in /sections and add one line here.
 */
export const sections = [
    { id: 'hero', label: 'Home', Component: Hero },
    { id: 'about', label: 'About', Component: About },
    { id: 'skills', label: 'Skills', Component: Skills },
    { id: 'projects', label: 'Projects', Component: Projects },
    { id: 'contact', label: 'Contact', Component: Contact },
];

export const navLinks = sections.map(({ id, label }) => ({ name: label, href: `#${id}` }));
