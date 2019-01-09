<template>
	<main class="scene">
		<canvas id="tester"></canvas>

		<h3 id="mesh-name" class="mesh-name">{{activeMesh.name}}</h3>

		<template v-for="(item) in annotations">
			<Annotation
					:key="item.id"
					:id="item.id"
					:ref="item.id"
					:startPosition="item.position"
					:checkIntersection="controller.checkIntersection.bind(controller)"
					:isOpen="activeAnnotation === item.id"
			></Annotation>
		</template>

	</main>
</template>

<script>
	// @ is an alias to /src
	import SceneManager from '@modules/SceneManager'
	import { HttpService } from '@/http'

	import { mapState } from 'vuex'

	export default {
		name: 'scene',
		components: {
			//async loading on demand
			Annotation: () => import('@components/Annotation')
		},
		data: () => ({
			intersected: null,
		}),
		computed: {
			// mapState helper provides an access to a store variables via shortcuts,
			// for ex: this.models instead of this.$store.state.models
			...mapState(['models', 'controller', 'theme', 'annotations', 'activeAnnotation', 'activeMesh']),
		},
		mounted() {
			const canvas = document.getElementById('tester');
			const controller = new SceneManager(canvas);

			//update annotations position
			controller.on('controlsChanged', () => this.updateNotesPosition(controller));
			controller.on('resize', () => this.updateNotesPosition(controller));

			canvas.addEventListener('mousedown', (e) => this.highlightMesh(e, controller));

			//share the controller instance store-wide, for ex to use inside of Toolbar.vue
			this.$store.commit('SET_CONTROLLER', controller);


			//fetch models
			HttpService.getPosts().then(res => {

				//store models
				this.$store.commit('SET_MODELS', res);

				if (res.length) {
					//load model based on current URL
					const requested = res.filter(x => x.slug === this.$route.params.id)[0];

					if (requested) {
						this.loadModel(requested.slug);
					}

					//otherwise redirect to the first route in collection
					else {
						console.log('test');
						this.$router.push(res[0].slug);
					}
				}
				else {
					//TODO load some default model
					console.log('no models yet');
				}

			});

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

						this.$store.commit('SET_ACTIVE_MESH', {
							name: intersection.object.name.replace(/_/g, " "),
							object: intersection.object
						});
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
			},

			loadModel(slug) {
				const model = this.models.filter(x => x.slug === slug)[0];

				this.controller.load(model.url, () => {
					this.$store.commit('CLEAR_NOTES');
					this.$store.commit('SET_ACTIVE_MESH', {});

					console.log('loaded', model.title);
				});
			}
		},
		watch: {
			//track router changes
			'$route'(to) {
				this.loadModel(to.params.id);
			},
			'theme.dark'(to) {
				this.controller.switchTheme(to);
			}
		}
	}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.mesh-name {
		position: absolute;
		text-align: center;
		left: 30%;
		right: 30%;
		bottom: 0;
		color: var(--black);
	}
</style>