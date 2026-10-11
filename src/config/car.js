/**
 * The 3D car (public/models/lambo-opt.glb: textures resized, meshopt-compressed).
 * heading  fixed direction the car faces on screen (radians about Y; ~1.1 = facing screen-right)
 * doors    hinge `axis` and opening `angle`; the lift direction is picked per door automatically
 * paint    the exterior body paint: the model's `material` (a carbon-weave texture, "Carbon_R") is
 *          cloned for the exterior meshes only; meshes under a `skip` ancestor (interior trim that
 *          shares the same material) keep the original
 * entry    how far (car lengths) and how high the car starts when it drives in on load
 */
export const car3d = {
    src: '/models/lambo-opt.glb',
    heading: 1.1,
    doors: { axis: 'x', angle: 1.1 },
    paint: { material: 'Carbon_R', skip: /interior|seats|movsteer|display/i },
    entry: { distance: 2.6, height: 0.6 },
};
