/**
 * The 3D car (public/models/lambo-opt.glb: textures resized, meshopt-compressed).
 * heading  fixed direction the car faces on screen (radians about Y; ~1.1 = facing screen-right)
 * doors    hinge `axis` and opening `angle`; the lift direction is picked per door automatically
 * repaint  body materials that shift from black to `color` (`gain` brightens the dark carbon
 *          textures, `glow` adds a touch of emissive)
 * entry    how far (car lengths) and how high the car starts when it drives in on load
 */
export const car3d = {
    src: '/models/lambo-opt.glb',
    heading: 1.1,
    doors: { axis: 'x', angle: 1.1 },
    repaint: { materials: ['Carbon_R', 'Carbon_M', 'CENTENARIO', 'material_0'], color: '#e11d2e', gain: 8, glow: 0.12 },
    entry: { distance: 2.6, height: 0.6 },
};
