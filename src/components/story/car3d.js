/**
 * three.js stage for the car: a transparent WebGL canvas with a glTF car whose pose and camera
 * are driven by a continuous station index (see config/story.js). three is loaded on demand so it
 * stays out of the main bundle.
 *
 * Exterior paint: the model's body is one carbon-weave material ("Carbon_R") that interior trim
 * also uses, so the exterior meshes get their own physical-material clone. A small shader hook blends
 * the weave toward the chosen colour (keeping a trace of its depth), and the finish values (metalness,
 * roughness, clearcoat) ease with it. Interior meshes keep the original material untouched.
 *
 * Conventions (car frame, car length = 1): +z = nose, +x = across, y = up. The camera orbits a
 * target point described by azimuth / elevation / distance, so a pose reads the same whichever way
 * the car happens to face the screen.
 */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export async function createCarStage(canvas, options) {
    const { src, heading, entry, doors, paint: paintCfg, stations } = options;
    const THREE = await import('three');
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
    const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js');

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Key light, cool-white rim and steel-blue fill (neutral, so they never tint the paint); their strength scales down with `fade`.
    const lights = [
        { light: new THREE.DirectionalLight(0xffffff, 1.1), at: [3, 5, 4] },
        { light: new THREE.DirectionalLight(0xc4d4ff, 1.6), at: [-4, 2, -3] },
        { light: new THREE.DirectionalLight(0x4670aa, 1.2), at: [4, 1, -2] },
    ].map((l) => {
        l.light.position.set(...l.at);
        scene.add(l.light);
        return { light: l.light, base: l.light.intensity };
    });

    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);

    // `lane` fixes the heading and is the camera's frame; the car (`pivot`) moves/turns inside it.
    const lane = new THREE.Group();
    lane.rotation.y = heading;
    scene.add(lane);
    const pivot = new THREE.Group();
    lane.add(pivot);

    const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(src);
    const model = gltf.scene;
    const raw = new THREE.Box3().setFromObject(model);
    const rawSize = raw.getSize(new THREE.Vector3());
    model.scale.setScalar(1 / Math.max(rawSize.x, rawSize.z)); // car length -> 1
    const fitted = new THREE.Box3().setFromObject(model);
    const dims = fitted.getSize(new THREE.Vector3());
    model.position.sub(fitted.getCenter(new THREE.Vector3()));
    pivot.add(model);
    lane.updateMatrixWorld(true);

    // Soft contact shadow under the car.
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d');
    const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,0,0,0.65)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1.5),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -dims.y / 2 + 0.002;
    pivot.add(shadow);

    // ---- Door hinges (the parent of each door mesh) ------------------------------------------
    const hinges = [];
    model.traverse((node) => {
        if (node.children.some((c) => /door/i.test(c.name)) && !hinges.includes(node)) hinges.push(node);
    });
    // The two hinge rigs are not guaranteed to share an orientation: pick, per door, the sign that lifts it.
    const liftSign = new Map();
    hinges.forEach((h) => {
        const centreY = (angle) => {
            h.rotation[doors.axis] = angle;
            h.updateMatrixWorld(true);
            return new THREE.Box3().setFromObject(h).getCenter(new THREE.Vector3()).y;
        };
        liftSign.set(h, centreY(doors.angle) >= centreY(-doors.angle) ? 1 : -1);
        h.rotation[doors.axis] = 0;
        h.updateMatrixWorld(true);
    });

    // ---- Exterior paint + tail lights --------------------------------------------------------
    const tail = [];
    let paintMat = null;
    const paintUniforms = { uPaint: { value: new THREE.Color('#C8102E') }, uMix: { value: 0 } };
    const paintColor = paintUniforms.uPaint.value;
    const paintTarget = new THREE.Color('#C8102E');
    let paintHex = '#151515';
    let paintAmount = 0; // 0 = original carbon, 1 = fully painted
    let original = null;
    const seen = new Set();
    model.traverse((o) => {
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        mats.forEach((m) => {
            if (seen.has(m)) return;
            seen.add(m);
            if (m.name === 'LIGT_RED') tail.push({ m, base: m.emissive.clone(), baseIntensity: m.emissiveIntensity ?? 1 });
        });
        // Exterior body meshes only: skip anything under interior / seat / steering / display nodes.
        if (!o.isMesh || !o.material || o.material.name !== paintCfg.material) return;
        for (let a = o.parent; a; a = a.parent) if (paintCfg.skip.test(a.name)) return;
        if (!paintMat) {
            const src = o.material;
            original = { metalness: src.metalness, roughness: src.roughness };
            paintMat = new THREE.MeshPhysicalMaterial({ map: src.map, color: 0xffffff, metalness: src.metalness, roughness: src.roughness, side: src.side });
            paintMat.name = 'ExteriorPaint';
            paintMat.envMapIntensity = 0.42;
            paintMat.clearcoatRoughness = 0.06;
            paintMat.onBeforeCompile = (shader) => {
                Object.assign(shader.uniforms, paintUniforms);
                shader.fragmentShader = `uniform vec3 uPaint;\nuniform float uMix;\n${shader.fragmentShader}`.replace(
                    '#include <map_fragment>',
                    `#include <map_fragment>
                    float weave = clamp(dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)) * 3.0, 0.0, 1.0);
                    diffuseColor.rgb = mix(diffuseColor.rgb, uPaint * (0.9 + 0.1 * weave), uMix);`
                );
            };
        }
        o.material = paintMat;
    });

    // ---- Anchors: named points on the model, in car space -------------------------------------
    const side = -Math.sign(Math.sin(heading)) || 1; // which local side (+x/-x) faces the camera
    const centreOf = (obj) => pivot.worldToLocal(new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3()));
    const meshes = [];
    const nodes = [];
    model.traverse((o) => {
        nodes.push(o);
        if (o.isMesh) meshes.push(o);
    });
    const withMaterial = (name) => meshes.filter((m) => (Array.isArray(m.material) ? m.material : [m.material]).some((x) => x.name === name));
    const mean = (vs) => vs.reduce((a, v) => a.add(v), new THREE.Vector3()).multiplyScalar(1 / (vs.length || 1));
    const named = (re) => nodes.find((n) => re.test(n.name));
    // Real wheel pairs only (the model also has tiny helper nodes named like wheels).
    const wheelPairs = nodes
        .filter((n) => /^<?wheel/i.test(n.name))
        .map((n) => {
            const box = new THREE.Box3().setFromObject(n);
            return { centre: centreOf(n), size: box.getSize(new THREE.Vector3()) };
        })
        .filter((w) => w.size.y > 0.1 && w.size.x > 0.2);
    const frontPair = wheelPairs.filter((w) => w.centre.z > 0).sort((a, b) => b.size.y - a.size.y)[0];
    const tails = withMaterial('LIGT_RED').map(centreOf);

    const anchors = {
        center: new THREE.Vector3(),
        // The model's light glass is one mesh spanning both lamps, so place the lamp on the camera side explicitly.
        headlight: new THREE.Vector3(side * dims.x * 0.27, 0.004, 0.4),
        tailLight: tails.length ? mean(tails) : new THREE.Vector3(0, 0, -0.45),
        frontWheel: frontPair
            ? new THREE.Vector3(side * (frontPair.size.x / 2 - 0.02), frontPair.centre.y, frontPair.centre.z)
            : new THREE.Vector3(side * dims.x * 0.42, -dims.y * 0.08, 0.25),
        diffuser: new THREE.Vector3(0, -dims.y * 0.12, -0.46),
        seat: named(/^Seats/i) ? centreOf(named(/^Seats/i)) : new THREE.Vector3(0, -0.02, 0),
        steering: named(/steer/i) ? centreOf(named(/steer/i)) : new THREE.Vector3(side * 0.05, 0, 0.1),
        display: named(/^Display/i) ? centreOf(named(/^Display/i)) : new THREE.Vector3(0, 0, 0.15),
    };

    // Resolve stations to numeric poses once.
    const poses = stations.map((st) => ({ ...st, target: anchors[st.at].clone().add(new THREE.Vector3(...st.off)) }));

    let width = 1;
    let height = 1;
    let lastTime = 0;
    let lastInteract = 0;
    const tmpTarget = new THREE.Vector3();
    const tmpEye = new THREE.Vector3();

    const resize = (w, h, dprCap = 1.75) => {
        width = w;
        height = h;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
    };

    /**
     * view.s: station index (continuous). view.intro: 0..1 drive-in on load.
     * opts.shift: allow the car to sit right of centre (wide screens only); opts.compact: narrow screen; opts.drift: allow the hero camera drift;
     * Returns { fade, busy }: `fade` (0..1) darkens the page with the scene; `busy` asks for another frame.
     */
    const update = (view, time, opts = {}) => {
        const si = clamp(view.s, 0, poses.length - 1);
        const i = Math.min(Math.floor(si), poses.length - 2);
        const f = si - i;
        const A = poses[i];
        const B = poses[i + 1];
        const ch = (k) => lerp(A[k], B[k], f);

        // Car channels.
        const intro = view.intro;
        // Interaction (customizer): auto-rotation + drag, weighted by `interact` so it eases out on scroll.
        const w = ch('interact');
        const dtI = Math.min(0.1, Math.max(0, time - lastInteract));
        lastInteract = time;
        if (w > 0.01 && !view.dragging) {
            view.yawOffset += view.autoSpin * dtI + view.velocity;
            view.velocity *= 0.92;
        }
        if (w < 0.01) {
            view.yawOffset = 0;
            view.velocity = 0;
        }
        if (w > 0.99) view.yawOffset = ((((view.yawOffset + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
        pivot.rotation.y = ch('yaw') + view.yawOffset * w;
        view.camDelta += (view.camTarget - view.camDelta) * (1 - Math.exp(-dtI * 4));
        pivot.position.z = ch('carZ') - entry.distance * (1 - intro);
        pivot.position.y = entry.height * (1 - intro);
        const open = ch('door');
        hinges.forEach((h) => (h.rotation[doors.axis] = open * doors.angle * liftSign.get(h)));
        // Paint: nothing changes until a colour is chosen (`original`); then ease colour, finish and amount.
        const want = view.paint;
        if (want.hex !== paintHex) {
            paintHex = want.hex;
            paintTarget.set(want.hex);
        }
        const amountTarget = want.original ? 0 : 1;
        const dt = Math.min(0.5, Math.max(0, time - lastTime)); // time-based, so slow frames still converge
        lastTime = time;
        const ease = 1 - Math.exp(-dt * 7);
        const paintBusy =
            Math.abs(paintColor.r - paintTarget.r) + Math.abs(paintColor.g - paintTarget.g) + Math.abs(paintColor.b - paintTarget.b) > 0.002 ||
            Math.abs(paintAmount - amountTarget) > 0.002;
        if (paintBusy) {
            paintColor.lerp(paintTarget, ease);
            paintAmount += (amountTarget - paintAmount) * ease;
        }
        const mix = paintAmount;
        if (paintMat) {
            paintUniforms.uMix.value = mix;
            paintMat.metalness = lerp(original.metalness, want.metalness, mix);
            paintMat.roughness = lerp(original.roughness, want.roughness, mix);
            paintMat.clearcoat = mix * 0.35;
        }
        const glow = ch('tail');
        tail.forEach(({ m, base, baseIntensity }) => {
            m.emissive.copy(base).lerp(new THREE.Color(1, 0.05, 0.05), glow);
            m.emissiveIntensity = lerp(baseIntensity, 10, glow);
        });
        const fade = ch('fade');
        lights.forEach(({ light, base }) => (light.intensity = base * lerp(1, 0.15, fade)));
        if ('environmentIntensity' in scene) scene.environmentIntensity = lerp(1, 0.18, fade);
        renderer.toneMappingExposure = lerp(1.05, 0.85, fade);
        pivot.updateMatrixWorld(true);

        // Camera: orbit the target in the lane frame, scaled up on narrow screens so the car still fits.
        const aspect = width / height;
        const fit = clamp(1.76 / aspect, 1, 4);
        // Hero only: a very slow camera drift so the car feels alive while the page is at rest.
        const hero = opts.drift ? clamp(1 - view.s / 0.6, 0, 1) : 0;
        const az = ch('az') + view.camDelta * w + Math.sin(time * 0.5) * 0.035 * hero;
        const el = ch('el') + Math.sin(time * 0.37) * 0.01 * hero;
        // Wide shots need the full pull-back on a narrow screen; close-ups barely any.
        const wide = clamp(ch('dist') / 1.2, 0.25, 1);
        const dist = ch('dist') * (1 + (fit - 1) * wide * (aspect < 1 ? 0.8 : 1));
        tmpTarget.lerpVectors(A.target, B.target, f);
        tmpEye
            .set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el))
            .multiplyScalar(dist)
            .add(tmpTarget);
        camera.position.copy(lane.localToWorld(tmpEye.clone()));
        camera.lookAt(lane.localToWorld(tmpTarget.clone()));

        // Narrow screens: lift the car into the upper part of the frame so the copy sits below it.
        const lift = opts.compact ? height * 0.24 : 0;
        camera.setViewOffset(width, height, opts.shift === false ? 0 : -width * ch('shift'), lift, width, height);
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
        const busy = paintBusy || (w > 0.01 && (view.dragging || view.autoSpin > 0 || Math.abs(view.velocity) > 1e-4)) || Math.abs(view.camTarget - view.camDelta) > 1e-3;
        return { fade, busy };
    };

    /** Screen position of a named anchor (px), for DOM callouts. */
    const project = (name) => {
        const a = anchors[name];
        if (!a) return null;
        const q = pivot.localToWorld(a.clone()).project(camera);
        return { x: ((q.x + 1) / 2) * width, y: ((1 - q.y) / 2) * height, visible: q.z < 1 && Math.abs(q.x) < 1.4 && Math.abs(q.y) < 1.4 };
    };

    const dispose = () => {
        model.traverse((o) => {
            if (!o.isMesh) return;
            o.geometry.dispose();
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
                Object.values(m).forEach((v) => v && v.isTexture && v.dispose());
                m.dispose();
            });
        });
        shadow.geometry.dispose();
        shadow.material.map.dispose();
        shadow.material.dispose();
        scene.environment?.dispose();
        pmrem.dispose();
        renderer.dispose();
    };

    return { resize, update, project, dispose };
}
