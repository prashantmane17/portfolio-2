import Hero from '../sections/Hero';
import Showreel from '../sections/Showreel';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

/**
 * Single source of truth for page sections, in render order.
 * - `label`: text used by the navbar
 * - `transition`: scene entry, 'slide' (default), or 'zoom' (fades in on the backdrop's paint colour)
 * - `sceneClass`: optional background class for the section (omit to let the page canvas show through)
 * - `scene`: adjacent sections flagged true share the pinned canvas scroll scene;
 *            the rest scroll normally with a one-time reveal
 * To add a section: create it in /sections and add one line here.
 */
export const sections = [
    { id: 'hero', label: 'Home', Component: Hero, scene: true },
    { id: 'about', label: 'How', Component: About, scene: true, transition: 'zoom', sceneClass: 'bg-scene-paint' },
    { id: 'showreel', label: 'Showreel', Component: Showreel },
    { id: 'projects', label: 'Projects', Component: Projects },
    { id: 'contact', label: 'Contact', Component: Contact },
];

export const navLinks = sections.map(({ id, label }) => ({ name: label, href: `#${id}` }));
