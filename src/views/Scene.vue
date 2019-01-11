<template>
	<main class="scene" :class="$refs.pen && $refs.pen.isActive ? 'is-pencil-mode' : ''">
		<canvas id="tester"></canvas>

		<h3 id="mesh-name" class="mesh-name" :class="theme.dark ? 'light' : 'dark'">
			{{activeMesh.name}}
		</h3>

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

		<PencilTool :ref="'pen'" :canvas="canvas" v-show="mode.draw"></PencilTool>

	</main>
</template>

<script>
	import { mapState } from 'vuex'
	// @ is an alias to /src
	import { HttpService } from '@/http'
	import SceneManager from '@modules/SceneManager'

	export default {
		name: 'scene',

		components: {
			//async loading on demand
			Annotation: () => import('@components/Annotation'),
			PencilTool: () => import('@components/PencilTool')
		},

		data: () => ({
			intersected: null,
			canvas: null
		}),

		computed: {
			// mapState helper provides an access to a store variables via shortcuts,
			// for ex: this.models instead of this.$store.state.models
			...mapState([
				'models',
				'controller',
				'theme',
				'annotations',
				'activeAnnotation',
				'activeMesh',
				'mode',
			]),
		},

		created() {
			//get models from server
			this.fetchModels();
		},

		mounted() {
			const canvas = document.getElementById('tester');
			const controller = new SceneManager(canvas);

			this.canvas = canvas;
			
			//bind listeners
			this.bindEventListeners(controller, canvas);

			//share the controller instance store-wide, for ex to use inside of Toolbar.vue
			this.$store.commit('SET_CONTROLLER', controller);
		},

		methods: {
			fetchModels() {
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
							this.$router.push(res[0].slug);
						}
					}
					else {
						//TODO load some default model
						console.log('no models yet');
					}

				});
			},

			bindEventListeners(controller, canvas) {
				//update annotations position
				controller.on('controlsChanged', () => this.updateNotesPosition(controller));
				controller.on('resize', () => this.updateNotesPosition(controller));

				canvas.addEventListener('mousedown', (e) => this.highlightMesh(e, controller));
			},

			highlightMesh(e, controller) {
				if (this.mode.draw) return;

				const intersection = controller.checkIntersection(e)[0];

				let intersected = this.intersected;

				if (intersection) {
					if (intersected != intersection.object) {
						if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
						intersected = this.intersected = intersection.object;

						intersected.currentHex = intersected.material.emissive.getHex();
						intersected.material.emissive.setHex(0xaa00aa);

						console.log(intersected.material);

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
					this.$store.dispatch('CLEAR_SCENE');

					console.log('loaded', model.title);
				});
			},

			toggleFullScreen() {

				const doc = window.document;
				const docEl = doc.documentElement;

				const requestFullScreen = docEl.requestFullscreen
					|| docEl.mozRequestFullScreen
					|| docEl.webkitRequestFullScreen
					|| docEl.msRequestFullscreen;

				const cancelFullScreen = doc.exitFullscreen
					|| doc.mozCancelFullScreen
					|| doc.webkitExitFullscreen
					|| doc.msExitFullscreen;


				if (!doc.fullscreenElement
					&& !doc.mozFullScreenElement
					&& !doc.webkitFullscreenElement
					&& !doc.msFullscreenElement) {
					requestFullScreen.call(docEl);
				}
				else {
					cancelFullScreen.call(doc);
				}
			}

		},

		watch: {
			'$route'(to) {
				//track router changes
				this.loadModel(to.params.id);
			},
			'theme.dark'(to) {
				this.controller.switchTheme(to);
			},
			'mode.draw'(to) {
				this.$refs.pen.toggle(to);

				if(this.mobile) {
					this.toggleFullScreen();
				}
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
		&.light {
			color: var(--light-grey);
		}
	}

	#tester {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
	}


</style>