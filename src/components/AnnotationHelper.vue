<template>
	<div class="annotation-helper" :style="style">
		<div class="annotation-icon">
			<i class="fas fa-plus"></i>
		</div>
	</div>
</template>

<script>
    import { mapState } from 'vuex'

	export default {
		name: 'AnnotationHelper',
		data: () => ({
			style: {
				top: '',
				left: '',
				display: 'none'
			},
			isActive: false
		}),
		computed: {
            ...mapState('models', [
                'controller',
                'mode',
            ]),
		},
		mounted() {
			document.addEventListener('mousemove', this.move);
			document.addEventListener('click', this.place);
		},
		methods: {
			move(e) {
				if(!this.isActive) return;

				this.style.top = `${e.y}px`;
				this.style.left = `${e.x}px`;
				this.style.display = 'block';
			},

			place(e) {
				if(!this.isActive) return;

				const intersection = this.controller.checkIntersection(e);

				if (intersection) {

					this.style.display = 'none';
					this.$store.dispatch('models/ADD_NOTE', {
						//we'll need this later for positioning, for ex window resize or scene controls changes
						id: new Date().getTime(),
						text: {},
						position: {
							screen: this.controller.worldToScreen(intersection.point),
							intersection: intersection.point,
							object: intersection.object.position
						}
					});
				}
			},
		},
		watch: {
			'mode.annotation'(to) {
				document.body.style.cursor = to ? 'none' : 'default';
				this.isActive = to;
			}
		}
	}
</script>

<style>
	.annotation-helper {
		position: absolute;
		z-index: 1;
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
</style>