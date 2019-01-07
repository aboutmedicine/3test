<template>
	<main class="scene">
		<canvas id="tester"></canvas>

		<h3 id="mesh-name" class="mesh-name">{{activeMesh}}</h3>

		<template v-for="(item) in annotations">
			<Annotation
					:key="item.id"
					:id="item.id"
					:ref="item.id"
					:startPosition="item.position"
					:checkIntersection="$store.state.controller.checkIntersection"
					:isOpen="$store.state.activeAnnotation === item.id"
			></Annotation>
		</template>

	</main>
</template>

<script>
	// @ is an alias to /src
	import SceneManager from '@modules/SceneManager'

	export default {
		name: 'scene',
		components: {
			//async loading on demand
			Annotation: () => import('@components/Annotation')
		},
		data: () => ({
			intersected: null,
			activeMesh: ''
		}),
		computed: {
			annotations() {
				return this.$store.state.annotations
			},
		},
		mounted() {
			const canvas = document.getElementById('tester');
			const controller = new SceneManager(canvas);

			//update annotations position
			controller.on('controlsChanged', () => this.updateNotesPosition(controller));
			controller.on('resize', () => this.updateNotesPosition(controller));

			controller.load('/models/gltf/Eye_Anatomy_draco.gltf', () => {
				canvas.addEventListener('mousedown', (e) => this.highlightMesh(e, controller));
			});

			//share the controller instance store-wide, for ex to use inside of Toolbar.vue
			this.$store.commit('setController', controller);

		},
		methods: {
			highlightMesh(e, controller) {
				const intersection = controller.checkIntersection(e);

				let intersected = this.intersected;

				if (intersection) {
					if (intersected != intersection.object) {
						if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
						intersected = this.intersected = intersection.object;

						intersected.currentHex = intersected.material.emissive.getHex();
						intersected.material.emissive.setHex(0xaa00aa);

						this.activeMesh = intersection.object.name.replace(/_/g, " ");
					}
				}
			},
			updateNotesPosition(controller) {
				//TODO this might be not the best practice, consider another solution
				for (let id in this.annotations) {
					const annotation = this.$refs[id][0];
					const distA = controller.distanceToCamera(annotation.position.self);
					const distB = controller.distanceToCamera(annotation.position.parent);
					const diff = distB - distA;

					annotation.move(controller.worldToScreen(annotation.position.self));
					annotation.style.opacity = Math.min(Math.max(diff, 0.15), 1);
				}
			}
		},
		watch: {
			'$route'(to) {
				//TODO dynamic routes based on selected model
				console.log(to);
			}
		}
	}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>