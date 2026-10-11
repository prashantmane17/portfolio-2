import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

/**
 * Single source of truth for page sections, in render order.
 * - `label`: text used by the navbar
 * - `sceneClass` / `sceneStackedClass`: backgrounds for the scene (see Scenes.Scene)
 * - `scene`: adjacent sections flagged true share the pinned canvas scroll scene;
 *            the rest scroll normally with a one-time reveal
 * To add a section: create it in /sections and add one line here.
 */
export const sections = [
    { id: 'hero', label: 'Home', Component: Hero, scene: true, sceneStackedClass: 'bg-hero-cat bg-cover bg-center' },
    { id: 'about', label: 'About', Component: About, scene: true, sceneClass: 'bg-neon-about' },
    { id: 'skills', label: 'Skills', Component: Skills, scene: true, sceneClass: 'bg-neon-skills' },
    { id: 'projects', label: 'Projects', Component: Projects },
    { id: 'contact', label: 'Contact', Component: Contact },
];

export const navLinks = sections.map(({ id, label }) => ({ name: label, href: `#${id}` }));
