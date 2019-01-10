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

			<input class="annotation-title" placeholder="Annotation">
			<textarea class="annotation-details" rows="3" placeholder="Type Here..."></textarea>

			<button type="button" class="ico delete delete-annotation" @click="remove">
				<i class="fas fa-trash"></i>
			</button>
			<button type="button" class="ico save save-annotation" @click="save">
				<i class="fas fa-save ico "></i>
			</button>


		</div>
	</div>
</template>

<script>
	export default {
		name: 'Annotation',
		props: {
			id: Number,
			startPosition: Object,
			checkIntersection: Function,
			isOpen: Boolean,
		},
		data: () => ({
			isPlaced: false,
			position: {
				parent: null,
				self: null
			},
			style: {
				top: '',
				left: '',
				opacity: 1
			}
		}),
		mounted() {
			this.move(this.startPosition);
			document.addEventListener('mousemove', this.move);
			document.addEventListener('click', this.place);
			document.body.style.cursor = 'none';
		},
		methods: {
			place(e) {
				const intersection = this.checkIntersection(e)[0];

				if (intersection) {
					//clean up
					document.body.style.cursor = 'default';
					document.removeEventListener('mousemove', this.move);
					document.removeEventListener('click', this.place);

					this.open();
					this.isPlaced = true;

					//we'll need this later for positioning, for ex window resize or scene controls changes
					this.position.self = intersection.point;
					this.position.parent = intersection.object.position;

				}
			},
			move(toPoint = {}) {
				this.style.top = `${toPoint.y}px`;
				this.style.left = `${toPoint.x}px`;
			},
			remove() {
				this.$store.commit('REMOVE_NOTE', this.id);
			},
			save() {
				//TODO use localstorage
			},
			open() {
				this.$store.commit('SET_ACTIVE_NOTE', this.id);
			},
			close() {
				this.$store.commit('SET_ACTIVE_NOTE', null);
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