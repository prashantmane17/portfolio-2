export const personalInfo = {
    name: "Prashant Mane",
    role: "Web Animation Developer",
    experience: "2 years",
    about: "I build websites where motion does the talking: scroll-driven scenes, 3D and canvas that run at a steady 60fps, never at the cost of speed or accessibility.",
    email: "your.email@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
};

/** Animation work shown in the Projects section. Replace with real case studies. */
export const projects = [
    {
        title: "Scroll-Driven Product Launch",
        description: "A pinned, scrubbed story where the product turns, opens and zooms with every scroll, from first frame to checkout.",
        tech: ["GSAP", "ScrollTrigger", "Lenis"],
        liveUrl: "#",
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "3D Car Configurator Hero",
        description: "A real-time 3D model with opening doors, live paint changes and a camera that flies into the cabin.",
        tech: ["three.js", "WebGL", "glTF"],
        liveUrl: "#",
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Cinematic Agency Site",
        description: "Page transitions, masked text reveals and a canvas backdrop that drifts with the scroll.",
        tech: ["Canvas", "GSAP", "React"],
        liveUrl: "#",
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Interactive Storefront",
        description: "Micro-interactions and smooth-scrolling product galleries that stay fast on a mid-range phone.",
        tech: ["Shopify", "Lenis", "Motion"],
        liveUrl: "#",
        githubUrl: "#",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop"
    }
];

/** Static car PNG (public/car.png): used as the footage stand-in and on small screens. */
export const carImage = { src: "/car.png" };

/**
 * 3D hero car (public/models/lambo-opt.glb: your lambo.glb, textures resized and mesh-compressed).
 * `heading` = fixed direction the car faces (radians about Y; ~1.1 = facing screen-right).
 * `doors`   = hinge rotation on scroll: `axis` of the hinge node and the opening `angle` in radians
 *             (the direction is picked per door so both lift).
 * `cabin`   = where the camera ends up, relative to the steering wheel it looks at, in car lengths
 *             (x = across, y = up, z = toward the nose). Smaller numbers zoom in closer.
 * `entry`   = how far (car lengths) and how high the car starts when it drives in on load.
 * `repaint` = which body materials turn from black to `color` while the car centres (`gain` brightens
 *             the dark carbon textures, `glow` adds a little emissive).
 * `paint`   = the colour the zoom ends on (the next section's background matches it).
 */
export const car3d = {
    src: "/models/lambo-opt.glb",
    heading: 1.1,
    doors: { axis: "x", angle: 1.1 },
    cabin: { offset: [0.3, 0.07, -0.22] },
    repaint: { materials: ["Carbon_R", "Carbon_M", "CENTENARIO", "material_0"], color: "#d41f2b", gain: 8, glow: 0.12 },
    entry: { distance: 2.6, height: 0.6 },
    paint: "#b8141c",
};

/** Full-width footage for the Showreel section. Set `src` (e.g. "/showreel.mp4" in /public) when ready;
 *  until then the car image stands in. */
export const showreel = { src: null, poster: "/car.png" };
