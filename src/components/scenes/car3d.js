/**
 * three.js stage for the hero car: a transparent WebGL canvas with a glTF car that
 * drives along a track (fixed heading, no spin), then orbits/dollies the camera into the windshield.
 * three is loaded on demand so it stays out of the main bundle.
 *
 * `windshield.at` is the glass centre as fractions of the model's normalised bounding
 * box (each in -0.5..0.5, centred), `windshield.halfWidth` is half its width as a fraction
 * of the car's length, and `windshield.lateral` is the car's left-right axis in model space.
 */
const lerp = (a, b, t) => a + (b - a) * t;

export async function createCarStage(canvas, options) {
    const { src, windshield, heading, travel } = options;
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
    // `lane` fixes the heading; the car (`pivot`) drives along the lane's +z axis.
    const lane = new THREE.Group();
    lane.rotation.y = heading;
    scene.add(lane);
    const pivot = new THREE.Group();
    lane.add(pivot);

    const gltf = await new GLTFLoader().loadAsync(src);
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const scale = 1 / Math.max(size.x, size.z); // car length -> 1
    model.scale.setScalar(scale);
    const fitted = new THREE.Box3().setFromObject(model);
    const center = fitted.getCenter(new THREE.Vector3());
    const dims = fitted.getSize(new THREE.Vector3());
    model.position.sub(center);
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

    // Wheels: re-pivot each wheel group on its own centre so it can spin around the axle.
    const wheels = [];
    model.updateMatrixWorld(true);
    model.traverse((node) => {
        if (!/^Wheel(Front|Rear)[LR]$/.test(node.name)) return;
        const wb = new THREE.Box3().setFromObject(node);
        const spinner = new THREE.Group();
        node.parent.add(spinner);
        spinner.position.copy(node.parent.worldToLocal(wb.getCenter(new THREE.Vector3())));
        spinner.updateMatrixWorld(true);
        spinner.attach(node);
        wheels.push({ spinner, radius: wb.getSize(new THREE.Vector3()).y / 2 });
    });

    // Track: a soft-edged asphalt strip with a gold dashed centre line and pale edge lines.
    const roadCanvas = document.createElement('canvas');
    roadCanvas.width = 256;
    roadCanvas.height = 512;
    const rctx = roadCanvas.getContext('2d');
    const asphalt = rctx.createLinearGradient(0, 0, 256, 0);
    asphalt.addColorStop(0, 'rgba(14,26,44,0)');
    asphalt.addColorStop(0.12, 'rgba(18,32,54,0.92)');
    asphalt.addColorStop(0.88, 'rgba(18,32,54,0.92)');
    asphalt.addColorStop(1, 'rgba(14,26,44,0)');
    rctx.fillStyle = asphalt;
    rctx.fillRect(0, 0, 256, 512);
    rctx.fillStyle = 'rgba(240,200,120,0.85)';
    for (let y = 0; y < 512; y += 128) rctx.fillRect(122, y + 16, 12, 64);
    rctx.fillStyle = 'rgba(246,231,193,0.55)';
    rctx.fillRect(40, 0, 4, 512);
    rctx.fillRect(212, 0, 4, 512);
    const roadTexture = new THREE.CanvasTexture(roadCanvas);
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.anisotropy = 8;
    roadTexture.colorSpace = THREE.SRGBColorSpace;
    const roadLength = travel * 3;
    roadTexture.repeat.set(1, roadLength / 0.5);
    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(dims.x * 2.2, roadLength),
        new THREE.MeshBasicMaterial({ map: roadTexture, transparent: true, depthWrite: false, opacity: 0 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.y = -dims.y / 2 - 0.001;
    lane.add(road);

    const anchorLocal = new THREE.Vector3(windshield.at[0] * dims.x, windshield.at[1] * dims.y, windshield.at[2] * dims.z);
    const lateral = new THREE.Vector3(...windshield.lateral).normalize();
    const anchor = { x: 0, y: 0, rx: 0, ry: 0 };
    let width = 1;
    let height = 1;

    const resize = (w, h) => {
        width = w;
        height = h;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
    };

    const smooth = (t) => {
        const x = Math.min(1, Math.max(0, t));
        return x * x * (3 - 2 * x);
    };
    const up = new THREE.Vector3(0, 1, 0);
    let lastDistance = 0;

    const update = ({ drive, p }, time) => {
        const hFov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect);
        const tanHalf = Math.tan(hFov / 2);
        const radius = 1 / 0.56 / (2 * tanHalf);
        const bob = Math.sin(time * 1.2) * 0.004 * (1 - p);

        // Drive: out past the right edge, then back in from the left and on to the centre.
        const distance = drive * travel * 2;
        pivot.position.z = distance <= travel ? distance : distance - travel * 2;
        const roll = (distance - lastDistance) / (wheels[0]?.radius || 0.07);
        lastDistance = distance;
        wheels.forEach((w) => w.spinner.rotateX(roll));
        road.material.opacity = smooth((drive - 0.02) / 0.12);
        lane.updateMatrixWorld(true);

        const anchorWorld = pivot.localToWorld(anchorLocal.clone());
        const start = new THREE.Vector3(0, dims.y * 0.9, radius);
        const target0 = new THREE.Vector3(0, -dims.y * 0.15, 0);

        // Push in: the camera swings round to face the glass and closes on it.
        const forward = new THREE.Vector3(0, 0, 1).transformDirection(lane.matrixWorld);
        const startDir = start.clone().sub(anchorWorld).normalize();
        const endDir = startDir.clone().multiplyScalar(0.5).addScaledVector(forward, 0.8).addScaledVector(up, 0.25).normalize();
        const dir = startDir.clone().applyQuaternion(new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(), new THREE.Quaternion().setFromUnitVectors(startDir, endDir), smooth(p)));
        const endDistance = (1.15 * windshield.halfWidth) / tanHalf;
        const dist = lerp(start.distanceTo(anchorWorld), endDistance, smooth(p));
        const dollyPos = anchorWorld.clone().addScaledVector(dir, dist);
        camera.position.copy(start).lerp(dollyPos, p > 0 ? 1 : 0);
        camera.position.y += bob;
        camera.lookAt(new THREE.Vector3().lerpVectors(target0, anchorWorld, smooth(p)));

        // Car sits right of centre in the hero, then centres as it sets off.
        camera.setViewOffset(width, height, -width * 0.17 * (1 - Math.min(1, drive / 0.3)) * (1 - p), 0, width, height);
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();

        shadow.material.opacity = 1 - p;
        renderer.render(scene, camera);

        // Where the windshield is on screen, for the footage window.
        const project = (v) => {
            const q = v.clone().project(camera);
            return { x: ((q.x + 1) / 2) * width, y: ((1 - q.y) / 2) * height };
        };
        const c = project(anchorWorld);
        const edge = project(anchorWorld.clone().addScaledVector(lateral.clone().transformDirection(lane.matrixWorld), windshield.halfWidth));
        anchor.x = c.x;
        anchor.y = c.y;
        anchor.rx = Math.hypot(edge.x - c.x, edge.y - c.y);
        anchor.ry = anchor.rx * 0.42;
        return anchor;
    };

    const dispose = () => {
        renderer.dispose();
        pmrem.dispose();
    };

    return { resize, update, dispose, anchor, dims };
}
