import { Code2, LayoutTemplate, Smartphone, Server } from 'lucide-react';

export const personalInfo = {
    name: "Prashant Mane",
    role: "Shopify Theme Developer",
    experience: "2 years",
    about: "I'm a passionate Full Stack Developer specializing in React and Shopify Theme Development. With 2 years of experience in frontend development, I build premium, responsive, and performant web applications that deliver exceptional user experiences.",
    email: "your.email@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
};

export const skills = [
    { name: "React JS", level: 90 },
    { name: "Next JS", level: 80 },
    { name: "JavaScript (ES6+)", level: 90 },
    { name: "HTML5 & CSS3", level: 95 },
    { name: "Tailwind CSS", level: 90 },
    { name: "Shopify Liquid", level: 85 },
    { name: "Shopify Theme Dev", level: 85 },
    { name: "Backend Integration", level: 75 },
];

export const projects = [
    {
        title: "Task Management Application",
        description: "A comprehensive React-based productivity app with real-time updates and an intuitive UI.",
        tech: ["React JS", "Tailwind CSS", "Node.js", "MongoDB"],
        liveUrl: "#",
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Evoxcel Website",
        description: "A premium business website with fluid animations, dynamic routing, and SEO optimization.",
        tech: ["Next.js", "Framer Motion", "Tailwind CSS"],
        liveUrl: "#",
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Personal Portfolio Theme",
        description: "A sleek, dark-themed portfolio template built for developers to showcase their work.",
        tech: ["React", "Framer Motion", "Vite"],
        liveUrl: "#",
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Storefront - E-commerce",
        description: "A fully custom Shopify theme for a high-end fashion brand with advanced filtering.",
        tech: ["Shopify Liquid", "JavaScript", "Tailwind CSS"],
        liveUrl: "#",
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop"
    }
];

/** Hero backdrop. `focus` = the glasses and `lenses` = each lens, as fractions of the image (centre x/y, width, height). */
export const heroImage = {
    src: "/cat-glasses.png",
    focus: {
        x: 0.507, y: 0.333, w: 0.255, h: 0.157,
        lenses: [
            { x: 0.445, y: 0.322, w: 0.098, h: 0.12 },
            { x: 0.584, y: 0.354, w: 0.092, h: 0.115 },
        ],
    },
};
