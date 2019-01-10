<template>
	<header class="top-panel">
		<div class="logo">
			<img id="logo" :src="logo" height="96" width="96">
		</div>
		<div class="toolbar">

			<div id="dissect" class="toolbar-button" @click="dissect">
				<i class="fa fa-scalpel"></i>
			</div>

			<div id="toolbar" class="toolbar-button knife">
				<i class="fa fa-cut"></i>

				<div class="toolbar-dropdown">
					<div class="toolbar-button">
						<i class="fa fa-square"></i>
					</div>
					<div class="toolbar-button">
						<i class="fa fa-minus"></i>
					</div>
					<div class="toolbar-button">
						<i style="transform: rotate(90deg)" class="fa fa-minus"></i>
					</div>
				</div>
			</div>

			<div id="annotation" class="toolbar-button" @click="addAnnotation">
				<i class="fa fa-file-medical"></i>
			</div>

			<div class="toolbar-button" @click="toggleDrawMode">
				<i class="fa fa-pencil"></i>
			</div>

			<div id="restore" class="toolbar-button" @click="reset">
				<i class="fa fa-redo-alt"></i>
			</div>

			<div class="toolbar-button" @click="dialog.upload = true">
				<i class="fa fa-upload"></i>

				<div class="menu" v-show="dialog.upload">
					<button type="button" class="ico close-modal" @click.stop="dialog.upload = false">
						<i class="fas fa-times"></i>
					</button>
					<Uploader></Uploader>
				</div>
			</div>

		</div>
		<div class="toolbar-social">
			<a href="http://ko-fi.com/reubenschmidt" class="social-button">
				<i class="fas fa-coffee"></i>
			</a>
		</div>
	</header>
</template>

<script>
	export default {
		data: () => ({
			dialog: {
				upload: false
			},
		}),
		components: {
			Uploader: () => import('@components/Uploader')
		},
		computed: {
			logo() { return this.$theme.dark ? 'assets/Logo_Night.png' : 'assets/Logo.png' },
		},
		methods: {
			reset() {
				this.$store.commit('CLEAR_SCENE');
			},
			dissect() {
				this.$store.commit('HIDE_MESH');
			},
			addAnnotation(e) {
				this.$store.dispatch('ADD_NOTE', {
					position: {
						x: e.clientX,
						y: e.clientY
					}
				});
			},
			toggleDrawMode() {
				this.$store.commit('TOGGLE_DRAW_MODE');
			}
		}
	}
</script>

<style lang="scss" scoped>

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
		z-index: 1;
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
		z-index: 1;
		align-items: center;
		grid-row-gap: 10px;
		grid-column-gap: 20px;
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


	#toolbar:hover .toolbar-dropdown {
		display: flex;
	}

	.toolbar-dropdown {
		display: none;
		position: absolute;
		flex-direction: column;
		left: 0;
		top: 100%;
		padding-top: 16px;

		> .toolbar-button + .toolbar-button{
			margin-top: 16px;
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
	}

	.social-button:hover {
		color: var(--dark-grey);
		cursor: pointer;
	}
</style>