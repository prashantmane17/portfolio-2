/**
 * three.js stage for the hero car: a transparent WebGL canvas with a glTF car.
 *  - intro (time-based): the car drives in from the upper left to its hero spot
 *  - p (scroll): the car glides to centre while turning one full circle, then the camera closes on its red body panel
 * three is loaded on demand so it stays out of the main bundle.
 *
 * `focus` is the body-panel point to zoom into, as fractions of the model's normalised
 * bounding box (each -0.5..0.5, centred). `heading` is the fixed direction the car faces.
 */
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
};

export async function createCarStage(canvas, options) {
    const { src, focus, heading, entry } = options;
    const THREE = await import('three');
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');

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

    const gltf = await new GLTFLoader().loadAsync(src);
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

    const focusLocal = new THREE.Vector3(focus[0] * dims.x, focus[1] * dims.y, focus[2] * dims.z);
    const outward = new THREE.Vector3(Math.sign(focus[0]) || -1, 0, 0);
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

        // Scroll: glide to centre, then close on the body panel.
        const centre = smooth(p / 0.4);
        const zoom = smooth((p - 0.4) / 0.6);
        pivot.rotation.y = Math.PI * 2 * smooth(p / 0.78); // one full turn, ending where it started
        pivot.updateMatrixWorld(true);
        const panel = pivot.localToWorld(focusLocal.clone());
        const start = new THREE.Vector3(0, dims.y * 0.9, radius);
        const target0 = new THREE.Vector3(0, -dims.y * 0.1, 0);
        const side = outward.clone().transformDirection(lane.matrixWorld);
        const endPosition = panel.clone().addScaledVector(side, 0.05);

        camera.position.copy(start).lerp(endPosition, zoom);
        camera.position.y += bob;
        camera.lookAt(new THREE.Vector3().lerpVectors(target0, panel, zoom));

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
