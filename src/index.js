import SceneManager from '@components/SceneManager'
import Annotation from '@components/Annotation'

const canvas = document.getElementById('tester');
const controller = new SceneManager(canvas);

if( !window.localStorage.annotations ) {
	window.localStorage.setItem('annotations', JSON.stringify({}));
}

const state = {
	action: null,
	// annotations: JSON.parse(window.localStorage.annotations), //not yet
	annotations: {},
	MODES: {
		moving: 1,
		placed: 2
	},
};


controller.restoreVisibility = () => {
	controller.scene.traverse((object) => {
		if (!object.visible) {
			object.visible = true;
		}
	});
};

controller.hideMesh = (mesh) => {
	mesh.visible = false;
};

controller.on('controlsChanged', () => {
	for(let key in state.annotations) {
		updateScreenPosition(state.annotations[key]);
	}
});

controller.load('./src/models/gltf/heart_animated2.gltf', () => {
	const meshName = document.getElementById('mesh-name');

	let selected, intersected;

	console.log(controller);

	document.getElementById('hide').addEventListener('click', () => controller.hideMesh(selected));

	document.getElementById('restore').addEventListener('click', controller.restoreVisibility);

	document.getElementById('annotation-add').addEventListener('click', addAnnotation);

	canvas.addEventListener('mousedown', (e) => {
		const intersection = controller.checkIntersection(e);

		if (intersection) {
			if (intersected != intersection.object) {
				if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
				intersected = intersection.object;
				intersected.currentHex = intersected.material.emissive.getHex();
				intersected.material.emissive.setHex(0xaa00aa);

				selected = intersected;
				meshName.innerHTML = intersection.object.name.replace(/_/g, " ");
			}
		} else {
			if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
			intersected = null;
		}

	}, false);
	
	for (let key in state.annotations) {
		const item = state.annotations[key];
		console.log(item);
	}
});

function addAnnotation(e) {
	document.body.style.cursor = 'none';

	//close other annotations
	for (let key in state.annotations) {
		state.annotations[key].close();
	}

	//create a new one
	const annotation = new Annotation({
		position: { x: e.clientX, y: e.clientY },
		appendTo: document.body
	});

	const moveAnnotation = (e) => {
		state.action = state.MODES.moving;
		annotation.move({ x: e.clientX, y: e.clientY });
	};

	const placeAnnotation = (e) => {
		if(state.action === state.MODES.moving) {
			state.action = state.MODES.placed;

			const intersection = controller.checkIntersection(e);

			if(intersection) {
				//clean up
				document.body.style.cursor = 'default';
				document.removeEventListener('mousemove', moveAnnotation);
				document.removeEventListener('click', placeAnnotation);

				annotation.place(intersection.point, intersection.object.position);
				annotation.open();

				annotation.html.addEventListener('click', (e) => {
					if (e.target.matches('.delete-annotation, .delete-annotation *')) {
						removeAnnotation(annotation.id);
					}
					if (e.target.matches('.save-annotation, .save-annotation *')) {
						saveAnnotation(annotation);
					}

				});

				//store in collection
				state.annotations[annotation.id] = annotation;
			}
		}
	};


	//handle mouse events
	document.addEventListener('mousemove', moveAnnotation);
	document.addEventListener('click', placeAnnotation);
}

function updateScreenPosition(annotation) {
	annotation.move(controller.worldToScreen(annotation.position.self));

	const distA = controller.distanceToCamera(annotation.position.self);
	const distB = controller.distanceToCamera(annotation.position.parent);
	const diff = distB - distA;

	annotation.html.style.opacity = Math.min(Math.max(diff, 0.15), 1);
}

function saveAnnotation(annotation) {
	state.annotations[annotation.id] = annotation;
	window.localStorage.annotations = JSON.stringify(state.annotations);
	console.log(window.localStorage);
}

function removeAnnotation(id) {
	const elem = document.getElementById(id);

	elem.parentNode.removeChild(elem);

	delete state.annotations[id];
	delete window.localStorage.annotations[id];

	console.log(window.localStorage);
}

function clearStorage() {
	window.localStorage.clear();
	console.log(window.localStorage);
}

function bindEventListeners() {
	window.onresize = resizeCanvas;
	
	document.getElementById('clear-storage').addEventListener('click', clearStorage);
}

function resizeCanvas() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	controller.resize();

	for(let key in state.annotations) {
		updateScreenPosition(state.annotations[key]);
	}
}

function render() {
	requestAnimationFrame(render);
	controller.update();
}

bindEventListeners();

resizeCanvas();

render();