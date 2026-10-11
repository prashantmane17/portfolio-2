import Hero from '../sections/Hero';
import Showreel from '../sections/Showreel';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

/**
 * Single source of truth for page sections, in render order.
 * - `label`: text used by the navbar
 * - `transition`: scene entry, 'slide' (default), 'push' (enters from the left), or 'zoom' (driven by the stage canvas)
 * - `sceneClass`: optional background for the scene (omit to let the page canvas show through)
 * - `scene`: adjacent sections flagged true share the pinned canvas scroll scene;
 *            the rest scroll normally with a one-time reveal
 * To add a section: create it in /sections and add one line here.
 */
export const sections = [
    { id: 'hero', label: 'Home', Component: Hero, scene: true },
    { id: 'showreel', label: 'Showreel', Component: Showreel, scene: true, transition: 'zoom' },
    { id: 'about', label: 'About', Component: About, scene: true, transition: 'push', sceneClass: 'bg-scene-about' },
    { id: 'skills', label: 'Skills', Component: Skills, scene: true, sceneClass: 'bg-scene-skills' },
    { id: 'projects', label: 'Projects', Component: Projects },
    { id: 'contact', label: 'Contact', Component: Contact },
];

export const navLinks = sections.map(({ id, label }) => ({ name: label, href: `#${id}` }));
