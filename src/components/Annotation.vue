<template>
	<div class="annotation"
	     :class="isOpen ? 'open' : ''"
	     :id="id"
	     :style="style"
	>
		<div class="annotation-icon" @click="open">
			<i class="fas fa-plus"></i>
		</div>
		<div class="annotation-content">
			<button type="button" class="ico close-annotation" @click="close">
				<i class="fas fa-times"></i>
			</button>

			<input class="annotation-title" placeholder="Annotation" name="title"
			       @input="inputChange"
			       :value="text.title"
			>
			<textarea class="annotation-details" rows="3" placeholder="Type Here..." name="description"
			          @input="inputChange"
			          :value="text.description"
			></textarea>

			<button type="button" class="ico delete delete-annotation" @click="remove">
				<i class="fas fa-trash"></i>
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Annotation',
		props: {
			id: Number,
			text: Object,
			isOpen: Boolean,
			position: {}
		},
		data: () => ({
			style: {
				top: '',
				left: '',
				opacity: 1
			},
			title: '',
			description: ''
		}),
		computed: {
			controller() {
				return this.$store.state.models.controller
			}
		},
		mounted() {
			//update annotations position
			this.updatePosition();
			this.controller.on('controlsChanged', this.updatePosition);
			this.controller.on('resize', () => this.updatePosition);
		},
		methods: {
			updatePosition() {
				this.$nextTick(() => {
					this.move(this.controller.worldToScreen(this.position.intersection));

					if(!this.isOpen) {
						const distA = this.controller.distanceToCamera(this.position.intersection);
						const distB = this.controller.distanceToCamera(this.position.object);
						const diff = distB - distA;
						this.style.opacity = Math.min(Math.max(diff, 0.15), 1);
					}

				});
			},

			move(toPoint = {}) {
				this.style.top = `${toPoint.y}px`;
				this.style.left = `${toPoint.x}px`;
			},

			remove() {
				this.$store.commit('models/REMOVE_NOTE', this.id);
			},

			inputChange(e) {
				console.log(e.target.value, e.target.name);
				this.$store.commit('models/EDIT_NOTE', {
					key: e.target.name,
					value: e.target.value
				});
			},

			open() {
				this.$store.commit('models/SET_ACTIVE_NOTE', this.id);
				this.style.opacity = 1;
			},

			close() {
				this.$store.commit('models/SET_ACTIVE_NOTE', null);
				this.updatePosition();
			}
		}

	}
</script>

<style lang="scss">

	.annotation {
		position: absolute;
		z-index: 1;
	}

	.annotation-content {
		padding: 1em;
		background: var(--black);
		border-radius: 0px 20px 20px 20px;
		line-height: 1.3;
		text-align: right;
		position: absolute;
		left: 0;
		top: 0;
		min-width: 300px;
		min-height: 150px;
		display: none;
	}

	.annotation.open {}

	.annotation.open .annotation-content {
		display: block;
	}

	.annotation-icon {
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		width: 36px;
		height: 36px;
		background: rgba(50, 50, 50, 0.8);
		border-radius: 0px 20px 20px 20px;
		color: #fff;
		font-size: 25px;
		text-align: center;
		transition: color ease-out .15s;
	}


	.annotation-icon:hover {
		color: var(--grey);
	}

	.annotation.open .annotation-icon {
		opacity: 0;
	}

	.annotation-title {
		font-size: 1.5em;
		font-weight: 600;
	}

	.annotation-details {
		font-size: 1em;
		font-weight: 600;
	}

	.close-annotation {
		position: absolute;
		right: 20px;
		top: 20px;
	}

	.annotation textarea,
	.annotation input {
		color: #fafafa;
		font-weight: 300;
		font-family: 'Avenir Next';
		margin-bottom: 10px;
		background: none;
		border: none;
		width: 95%;
		resize: none;
		text-align: left;
	}
</style>