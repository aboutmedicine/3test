import * as THREE from 'three';
import Dispatcher from '@components/Dispatcher';

require('imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js');
require('imports-loader?THREE=three!exports-loader?THREE.DRACOLoader!@libs/loaders/DRACOLoader.js');
require('@libs/loaders/GLTFloader.js');

THREE.DRACOLoader.setDecoderPath('@libs/dracodecoder/');

class SceneManager extends Dispatcher {
	constructor(canvas) {
		super();

		const screen = {
			width: canvas.width,
			height: canvas.height
		};
		const scene = this._buildScene();
		const camera = this._buildCamera(screen);
		const renderer = this._buildRenderer(canvas, screen);
		const controls = this._buildControls(camera, renderer);
		const mouse = new THREE.Vector2();
		const raycaster = new THREE.Raycaster();
		const loader = new THREE.GLTFLoader();

		loader.setDRACOLoader(new THREE.DRACOLoader());

		this._loader = loader;
		this._scene = scene;
		this._camera = camera;
		this._screen = screen;

		//public API
		this.update = () => {
			renderer.render(scene, camera);
			controls.update();
		};

		this.resize = () => {
			const { width, height } = canvas;

			screen.width = width;
			screen.height = height;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
		};
        
        this.resetCamera = () => {
            controls.reset();
        }

		this.checkIntersection = (event) => {
			let x = (event.clientX / window.innerWidth) * 2 - 1;
			let y = -(event.clientY / window.innerHeight) * 2 + 1;

			mouse.set(x, y);
			
			raycaster.setFromCamera(mouse, camera);

			let intersects = raycaster.intersectObject(this._interactiveObjects, true);
			let intersection = intersects[0];

			return intersection;
		}

		//Events list
		controls.addEventListener('change', () => this.dispatch('controlsChanged'));
	}

	load(path, callback) {
		this._loader.load(path, (gltf) => {
			this._scene.add(gltf.scene);
			this._interactiveObjects = gltf.scene;

			callback();
		});
	}

	worldToScreen(vector3Point) {
		const vector = new THREE.Vector3().copy(vector3Point);
		const hw = this._screen.width / 2;
		const hh = this._screen.height / 2;

		vector.project(this._camera);
		
		vector.x = ( vector.x * hw ) + hw;
		vector.y = - ( vector.y * hh ) + hh;

		return { x: vector.x, y: vector.y };
	}

	distanceToCamera(vector) {
		return this._camera.position.distanceTo(vector);
	}

	get scene() {
		return this._scene;
	}

	_buildScene() {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff);

		const ambient = new THREE.AmbientLight(0xeeeeee);
		scene.add(ambient);

		const pointLight = new THREE.PointLight(0xdddddd, 1, 5);
		pointLight.position.set(50, 50, 50);
		scene.add(pointLight);

		return scene;
	}

	_buildRenderer(canvas, { width, height }) {
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
			// alpha: true
		});
		const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
		renderer.setPixelRatio(DPR);
		renderer.setSize(width, height);

		return renderer;
	}

	_buildCamera({ width, height }) {
		const camera = new THREE.PerspectiveCamera(55, width / height, .5, 4000);
		camera.position.x = 5;
		camera.position.y = 5;
		camera.position.z = 10;

		return camera;
	}

	_buildControls(camera, renderer) {
		const controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.maxDistance = 50;
		controls.minDistance = 5;
		controls.enableZoom = true;
		controls.rotateSpeed = 0.75;
		controls.smoothZoom = true;
		controls.zoomDampingFactor = controls.dampingFactor;
		controls.smoothZoomSpeed = 5.0;

		return controls;
	}
}

export default SceneManager;