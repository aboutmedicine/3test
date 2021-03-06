<template>
	<header class="top-panel">
		<div class="logo">
			<img alt="About Medicine" id="logo" :src="logo" height="96" width="96">
		</div>
		<div class="toolbar">

			<div id="dissect" class="toolbar-button" @click="dissect" data-tooltip-bottom="Remove part">
				<i class="fa fa-eye-slash"></i>
			</div>

			<div id="toolbar" class="toolbar-button knife" @click="dialog.clip = !dialog.clip">
				<i class="fa fa-cut"></i>

				<div class="toolbar-dropdown" v-show="!mobile || dialog.clip">
					<div class="toolbar-button" @click.stop="clip(0,0,-1)" data-tooltip-bottom="Cut coronal">
						<i class="fa fa-square"></i>
					</div>
					<div class="toolbar-button" @click.stop="clip(0,-1,0)" data-tooltip-bottom="Cut transverse">
						<i class="fa fa-minus"></i>
					</div>
					<div class="toolbar-button" @click.stop="clip(-1,0,0)" data-tooltip-bottom="Cut sagittal">
						<i style="transform: rotate(90deg)" class="fa fa-minus"></i>
					</div>
				</div>
			</div>

			<div id="annotation" class="toolbar-button" @click="toggleAnnotationMode" data-tooltip-bottom="Annotate part">
				<i class="fa fa-file-medical"></i>

			</div>

			<div class="toolbar-button" @click="toggleDrawMode" data-tooltip-bottom="Drawing mode">
				<i class="fa fa-pencil"></i>
			</div>

			<div id="restore" class="toolbar-button" @click="reset" data-tooltip-bottom="Reset model">
				<i class="fa fa-redo-alt"></i>
			</div>

			<div id="upload" class="toolbar-button" v-if="user"
			     @click="dialog.upload = !dialog.upload">
				<i class="fa fa-upload"></i>

				<div class="menu" v-show="dialog.upload" @click.stop>
					<button type="button" class="ico close-modal" @click.stop="dialog.upload = false">
						<i class="fas fa-times"></i>
					</button>
					<Uploader></Uploader>
				</div>
			</div>

		</div>
		<div class="toolbar-social">
			 <a href="https://www.patreon.com/aboutmedicine" class="social-button">
				<i class="fab fa-patreon"></i>
			</a> 
			
		</div>


	</header>
</template>

<script>
    import { mapState } from 'vuex'

	export default {
		data: () => ({
			dialog: {
				upload: false,
				clip: false
			},

		}),
		components: {
			Uploader: () => import('@components/Uploader')
		},
		computed: {
			logo() {
				return this.$theme.dark ? 'assets/Logo_Night.png' : 'assets/Logo.png'
			},
			...mapState([
			    'user'
			]),
			...mapState('models', [
			    'controller',
				'mode',
			]),
			mobile() {
				return this.$store.state.mobile
			}
		},
		methods: {
			reset() {
				this.$store.dispatch('models/CLEAR_SCENE');
			},
			dissect() {
				this.$store.dispatch('models/HIDE_MESH');
			},
			toggleAnnotationMode() {
				this.$store.commit('models/SET_ACTIVE_NOTE', null);
				this.$store.commit('models/SET_ANNOTATION_MODE', !this.mode.annotation);
			},
			toggleDrawMode() {
				this.$store.commit('models/TOGGLE_DRAW_MODE');
			},
			clip(...args) {
				this.controller.clip(...args);
				this.dialog.clip = false;
			},
		}
	}
</script>

<style lang="scss" >

	.close-modal {
		position: absolute;
		right: 10px;
		top: 10px;
		color: #000;
	}

	.menu {
		background: #fff;
		position: absolute;
		top: calc(100% + 10px);
		left: 0;
		z-index: 2;
		padding: 20px;
		border-radius: 0.5em;
		border: 2px solid #eeeeee;
	}

	.top-panel {
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: auto 1fr;
		position: absolute;
		left: 16px;
		top: 16px;
		z-index: 3;
		align-items: center;
		grid-row-gap: 10px;
		grid-column-gap: 20px;
		pointer-events: none;
		& > * {
			pointer-events: auto;
		}
	}

	.toolbar {
		display: flex;
		justify-content: left;
		position: relative;
		z-index: 1;
		> .toolbar-button + .toolbar-button {
			margin-left: 16px;
		}
	}

	.toolbar-button {
		position: relative;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background-color: var(--grey);
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30px;
		transition: .2s;

	}

	.toolbar-button:hover {
		background-color: var(--dark-grey);
		cursor: pointer;
	}

	.desktop #toolbar:hover .toolbar-dropdown {
		display: flex;
	}

	.toolbar-dropdown {
		position: absolute;
		flex-direction: column;
		left: 0;
		top: 100%;
		padding-top: 16px;

		> .toolbar-button + .toolbar-button {
			margin-top: 16px;
		}
		.desktop & {
			display: none;
		}
	}

	.toolbar-social {
		display: flex;
		left: 40px;
		top: 128px;
		flex-direction: column;
		align-items: center;
	}

	.social-button {
		position: relative;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		color: var(--grey);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32px;
		transition: .2s;
    text-decoration: none;
	}

	.social-button:hover {
		color: var(--dark-grey);
		cursor: pointer;
    text-decoration: none;
	}

	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media (max-width: 767px) {
		#annotation, #upload {
			display: none;
		}
		.toolbar-button {
			font-size: 25px;
			width: 42px;
			height: 42px;
		}
		.toolbar > .toolbar-button + .toolbar-button {
			margin-left: 8px;
		}
		.top-panel {
			grid-column-gap: 10px;
			grid-row-gap: 5px;
			top: 10px;
			left: 10px;
		}
		#logo {
			width: 48px;
			height: 48px;
		}
	}

	

</style>