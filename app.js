let scene, camera, renderer, ambient, pointLight, loader, raycaster, control;

scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, .5, 4000);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 10;
renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
ambient = new THREE.AmbientLight(0xeeeeee)
scene.add(ambient);

pointLight = new THREE.PointLight(0xdddddd, 1, 100);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

loader = new THREE.GLTFLoader();

THREE.DRACOLoader.setDecoderPath('js/dracodecoder/');
loader.setDRACOLoader(new THREE.DRACOLoader());
loader.load('models/gltf/heart_animated2.gltf', function (gltf) {
    scene.add(gltf.scene);
    console.log(scene.children[2].children);

    raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2(),
        intersected;

    function onMouseDown(event) {
        let mousex = (event.clientX / window.innerWidth) * 2 - 1
        let mousey = -(event.clientY / window.innerHeight) * 2 + 1
        mouse.set(mousex, mousey);

        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObject(gltf.scene, true);
        let intersection = intersects[0];

        if (intersects.length > 0) {
            if (intersected != intersects[0].object) {
                if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
                intersected = intersects[0].object;
                intersected.currentHex = intersected.material.emissive.getHex();
                intersected.material.emissive.setHex(0xaa00aa);
                document.getElementById('mesh-name').innerHTML = intersection.object.name.replace(/_/g, " ");
            }
        } else {
            if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
            intersected = null;
        }
    }
    document.addEventListener('mousedown', onMouseDown, false);
}, );

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.maxDistance = 50;
controls.minDistance = 5;
controls.enableZoom = true;
controls.rotateSpeed = 0.75;
controls.smoothZoom = true;
controls.zoomDampingFactor = controls.dampingFactor;
controls.smoothZoomSpeed = 5.0;

function hide() {

    scene.traverse((object) => {
        if (object.name === 'selected') {
            object.visible = false;
        }
    })
}

function render() {
    renderer.render(scene, camera)
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
};

animate();
