/**
 * three.js stage for the hero car: a transparent WebGL canvas with a glTF car.
 *  - intro (time-based): the car drives in from the upper left to its hero spot
 *  - p (scroll): the car glides to centre while turning one full circle with its doors swinging
 *    open, then the camera flies in through the open door to the driver's seat
 * three is loaded on demand so it stays out of the main bundle.
 *
 * `heading` is the fixed direction the car faces. `doors` = { angle, axis } for the hinge nodes
 * (any node with a child named like "Door"; both swing the same way). `repaint` = { materials, color, gain, glow }:
 * body materials that shift from black to `color` as the car centres. `cabin.offset` places the final
 * camera relative to the steering wheel, in car lengths (x = across, y = up, z = toward the nose),
 * and the camera looks at the wheel.
 */
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
};

export async function createCarStage(canvas, options) {
    const { src, heading, entry, doors, cabin, repaint } = options;
    const THREE = await import('three');
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
    const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js');

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Key light plus gold rim and steel-blue fill to match the site palette.
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 5, 4);
    const rim = new THREE.DirectionalLight(0xd4a24c, 2.4);
    rim.position.set(-4, 2, -3);
    const fill = new THREE.DirectionalLight(0x4670aa, 1.2);
    fill.position.set(4, 1, -2);
    scene.add(key, rim, fill);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);

    // `lane` fixes the heading; the car (`pivot`) moves along the lane's +z axis.
    const lane = new THREE.Group();
    lane.rotation.y = heading;
    scene.add(lane);
    const pivot = new THREE.Group();
    lane.add(pivot);

    const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(src);
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    model.scale.setScalar(1 / Math.max(size.x, size.z)); // car length -> 1
    const fitted = new THREE.Box3().setFromObject(model);
    const dims = fitted.getSize(new THREE.Vector3());
    model.position.sub(fitted.getCenter(new THREE.Vector3()));
    pivot.add(model);

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

    // Door hinges: the parent of each door mesh (rigged as an empty at the hinge).
    const hinges = [];
    model.traverse((node) => {
        if (node.children.some((c) => /door/i.test(c.name)) && !hinges.includes(node)) hinges.push(node);
    });
    // Steering wheel position in the car's own space (the camera's final target).
    model.updateMatrixWorld(true);
    const steer = new THREE.Vector3();
    let steerNode = null;
    model.traverse((node) => {
        if (!steerNode && /steer/i.test(node.name)) steerNode = node;
    });
    new THREE.Box3().setFromObject(steerNode || model).getCenter(steer);
    const lookLocal = pivot.worldToLocal(steer);
    // Come in from the side the camera starts on, so the open door is between it and the wheel.
    const cameraSide = -Math.sign(Math.sin(heading)) || 1; // which local side (+x/-x) faces the camera
    const eyeLocal = lookLocal.clone().add(new THREE.Vector3(Math.abs(cabin.offset[0]) * cameraSide, cabin.offset[1], cabin.offset[2]));

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
    // Repaint: tint the body materials from their original black toward `repaint.color` while centring.
    const paint = new THREE.Color(repaint.color);
    const tinted = [];
    const seenMaterials = new Set();
    model.traverse((o) => {
        const m = o.material;
        if (!m || seenMaterials.has(m) || !repaint.materials.includes(m.name)) return;
        seenMaterials.add(m);
        tinted.push({ m, base: m.color.clone() });
    });
    const target = paint.clone().multiplyScalar(repaint.gain);
    let width = 1;
    let height = 1;

    const resize = (w, h) => {
        width = w;
        height = h;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
    };

    const update = ({ p, intro }, time) => {
        const hFov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect);
        const radius = 1 / 0.56 / (2 * Math.tan(hFov / 2));
        const bob = Math.sin(time * 1.2) * 0.004 * (1 - p);

        // Entry: drive in from the upper left (down the lane).
        pivot.position.z = -entry.distance * (1 - intro);
        pivot.position.y = entry.height * (1 - intro);
        lane.updateMatrixWorld(true);

        // Scroll: glide to centre while turning and opening the doors, then fly into the cabin.
        const centre = smooth(p / 0.4);
        const zoom = smooth((p - 0.4) / 0.6);
        pivot.rotation.y = Math.PI * 2 * smooth(p / 0.78); // one full turn, ending where it started
        tinted.forEach(({ m, base }) => {
            m.color.copy(base).lerp(target, centre);
            m.emissive.copy(paint).multiplyScalar(repaint.glow * centre);
        });
        const open = smooth((p - 0.05) / 0.3);
        hinges.forEach((h) => (h.rotation[doors.axis] = open * doors.angle * liftSign.get(h)));
        pivot.updateMatrixWorld(true);

        const eye = pivot.localToWorld(eyeLocal.clone());
        const look = pivot.localToWorld(lookLocal.clone());
        const start = new THREE.Vector3(0, dims.y * 0.9, radius);
        const target0 = new THREE.Vector3(0, -dims.y * 0.1, 0);

        camera.position.copy(start).lerp(eye, zoom);
        camera.position.y += bob;
        camera.lookAt(new THREE.Vector3().lerpVectors(target0, look, zoom));

        // The car sits right of centre in the hero.
        camera.setViewOffset(width, height, -width * 0.17 * (1 - centre), 0, width, height);
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();

        shadow.material.opacity = 1 - zoom;
        renderer.render(scene, camera);
    };

    const dispose = () => {
        renderer.dispose();
        pmrem.dispose();
    };

    return { resize, update, dispose };
}
