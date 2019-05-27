<template>
	<main class="scene" :class="$refs.pen && $refs.pen.isActive ? 'is-pencil-mode' : ''">
		<canvas id="tester"></canvas>
        
	    <div class="mesh-name-box" :class="theme.dark ? 'light' : 'dark'">
	        <h3 id="mesh-name" class="mesh-name" :class="theme.dark ? 'light' : 'dark'">
				{{activeMesh.name}}
			</h3>
	    </div>


		<AnnotationHelper></AnnotationHelper>

		<template v-for="(item) in annotations">
			<Annotation
					:key="item.id"
					:id="item.id"
					:text="item.text"
					:position="item.position"
					:isOpen="activeAnnotation === item.id"
			></Annotation>
		</template>

		<PencilTool :ref="'pen'" :canvas="canvas" v-show="mode.draw"></PencilTool>

	</main>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	// @ is an alias to /src
	import { HttpService } from '@/http'
	import SceneManager from '@modules/SceneManager'

	export default {
		// name: 'scene',

		components: {
			//async loading on demand
			Annotation: () => import('@components/Annotation'),
			AnnotationHelper: () => import('@components/AnnotationHelper'),
			PencilTool: () => import('@components/PencilTool')
		},

		data: () => ({
			intersected: null,
			canvas: null,
		}),

		computed: {
			// mapState helper provides an access to a store variables via shortcuts,
			// for ex: this.models instead of this.$store.state.models
			...mapState('models',[
				'models',
				'controller',
				'activeAnnotation',
				'activeMesh',
				'mode',
			]),
			...mapState([
			    'theme'
			]),
			...mapGetters('models', [
				'annotations'
			])
		},

		created() {
		},

		mounted() {
			//get models from server
			this.fetchModels();
			const canvas = document.getElementById('tester');
			const controller = new SceneManager(canvas);

			//bind listeners
			canvas.addEventListener('mousedown', (e) => this.highlightMesh(e, controller));
			canvas.addEventListener('touchstart', (e) => this.highlightMesh(e, controller));

			this.canvas = canvas;

			//share the controller instance store-wide, for ex to use inside of Toolbar.vue
			this.$store.commit('models/SET_CONTROLLER', controller);
		},

		methods: {
			fetchModels() {
				HttpService.getPosts().then(res => {

					//store models
					this.$store.commit('models/SET_MODELS', res);

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
						console.log('no models yet');
					}

				});
			},

			highlightMesh(e, controller) {
				const intersection = controller.checkIntersection(e);

				let intersected = this.intersected;

				if (intersection) {
					if (intersected != intersection.object) {
						if (intersected) intersected.material.emissive.setHex(intersected.currentHex);
						intersected = this.intersected = intersection.object;

						intersected.currentHex = intersected.material.emissive.getHex();
						intersected.material.emissive.setHex(0xaa00aa);

						this.$store.commit('models/SET_ACTIVE_MESH', {
							name: intersection.object.name.replace(/_/g, " "),
							object: intersection.object
						});
					}
				}
			},

			loadModel(slug) {
				const model = this.models.filter(x => x.slug === slug)[0];

				this.controller.load(model.url, () => {
					this.$store.dispatch('models/CLEAR_SCENE');
					this.$store.commit('models/SET_CURRENT_MODEL', model._id);
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
			},
			activeMesh(nextValue) {
				if(!nextValue.object && this.intersected) {
					this.intersected.material.emissive.setHex(this.intersected.currentHex);
					this.intersected = null;
				}

			}

		}
	}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .mesh-name-box {
        position: absolute;
		text-align: center;
		left: 30%;
		right: 30%;
		bottom: 0;
        background-color: rgba(255, 255, 255, 0.7);
        &.light {
			background-color: rgba(0, 0, 0, 0.7);
		}
    }
    
	.mesh-name {
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