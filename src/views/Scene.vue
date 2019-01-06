<template>
	<div>
		<canvas id="tester"></canvas>
		<h3 id="mesh-name" class="mesh-name"></h3>
	</div>
</template>

<script>
	// @ is an alias to /src
	import SceneManager from '@modules/SceneManager'
	import Annotation from '@/modules/Annotation'

	export default {
		name: 'scene',
		components: {},
		data: () => ({
			action: null,
			selected: null,
			intersected: null,
			annotations: {},
			MODES: {
				moving: 1,
				placed: 2
			},
		}),
		mounted() {
			const canvas = document.getElementById('tester');
			const controller = new SceneManager(canvas);


			this.$store.commit('setController', controller);

			const state = {
				action: null,
				selected: null,
				intersected: null,
				annotations: {},
				MODES: {
					moving: 1,
					placed: 2
				},
			};

			//reset button
			controller.restoreVisibility = () => {
				controller.scene.traverse((object) => {
					if (!object.visible) {
						object.visible = true;
					}
					controller.resetCamera();
				});
			};

			//visibility button
			controller.hideMesh = (mesh) => {
				if (mesh) {
					mesh.visible = false;
				}
			};

			//update annotations position
			controller.on('controlsChanged', () => {
				for (let key in state.annotations) {
					updateScreenPosition(state.annotations[key]);
				}
			});


			controller.load('/models/gltf/Eye_Anatomy_draco.gltf', () => {
				console.log(controller);


				//TODO move out this, create a new onLoad method inside of controller
				document.getElementById('dissect').addEventListener('click', () => controller.hideMesh(state.selected));
				document.getElementById('restore').addEventListener('click', controller.restoreVisibility);
				document.getElementById('annotation').addEventListener('click', addAnnotation);

				canvas.addEventListener('mousedown', canvasClick);


			});


			function canvasClick(e) {
				const meshName = document.getElementById('mesh-name');
				const intersection = controller.checkIntersection(e);

				let intersected = state.intersected;

				if (intersection) {
					if (intersected != intersection.object) {
						if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
						intersected = state.intersected = intersection.object;

						intersected.currentHex = intersected.material.emissive.getHex();
						intersected.material.emissive.setHex(0xaa00aa);

						state.selected = intersected;
						meshName.innerHTML = intersection.object.name.replace(/_/g, " ");
					}
				}
			}

			function addAnnotation(e) {
				document.body.style.cursor = 'none';

				//close other annotations
				for (let key in state.annotations) {
					state.annotations[key].close();
				}

				//create a new one
				const annotation = new Annotation({
					position: {
						x: e.clientX,
						y: e.clientY
					},
					appendTo: document.body
				});

				const moveAnnotation = (e) => {
					state.action = state.MODES.moving;
					annotation.move({
						x: e.clientX,
						y: e.clientY
					});
				};

				const placeAnnotation = (e) => {
					if (state.action === state.MODES.moving) {
						state.action = state.MODES.placed;

						const intersection = controller.checkIntersection(e);

						if (intersection) {
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

			function removeAnnotation(id) {
				const elem = document.getElementById(id);

				elem.parentNode.removeChild(elem);

				delete state.annotations[id];
			}






			function resizeCanvas() {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;

				controller.resize();

				for (let key in state.annotations) {
					updateScreenPosition(state.annotations[key]);
				}
			}

			function render() {
				requestAnimationFrame(render);
				controller.update();
			}

			window.onresize = resizeCanvas;

			resizeCanvas();

			render();
		},
		watch: {
			'$route'(to, from) {
				console.log(to);
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>