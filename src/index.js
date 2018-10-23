import SceneManager from '@components/SceneManager'

const canvas = document.getElementById('tester');
const controller = new SceneManager(canvas);

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

controller.load('./src/models/gltf/heart_animated2.gltf', () => {
	const meshName = document.getElementById('mesh-name');

	let selected, intersected;

	console.log(controller);

	document.getElementById('hide').addEventListener('click', () => controller.hideMesh(selected));

	document.getElementById('restore').addEventListener('click', controller.restoreVisibility);

	document.addEventListener('mousedown', (e) => {
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
});

function bindEventListeners() {
	window.onresize = resizeCanvas;
	resizeCanvas();
}

function resizeCanvas() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	controller.resize();
}

function render() {
	requestAnimationFrame(render);
	controller.update();
}

bindEventListeners();

render();