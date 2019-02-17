<template>
	<portal to="modals-portal">

		<transition name="modal-fade">
			<div class="modal-backdrop" v-show="visible">
				<div class="modal">
					<header class="modal-header">

						<slot name="header"></slot>

						<button class="btn-close" @click="close">
							<i class="fa fa-times"></i>
						</button>

					</header>

					<section class="modal-body" v-if="$slots.body">
						<slot name="body"></slot>
					</section>

					<footer class="modal-footer" v-if="$slots.footer">
						<slot name="footer"></slot>
					</footer>
				</div>
			</div>
		</transition>

	</portal>
</template>

<script>
    export default {
        name: 'modal',
        data: () => ({
            visible: false,
        }),
        mounted() {
            document.querySelector('body').classList.add('noscroll');
            this.visible = true;
        },
        beforeDestroy() {
            this.visible = false;
        },
        destroyed() {
            document.querySelector('body').classList.remove('noscroll');

        },
        methods: {
            close() {
                this.$emit('close')
            }
        }
    };
</script>


<style>
	.modal-fade-enter,
	.modal-fade-leave-active {
		opacity: 0;
	}

	.modal-fade-enter-active,
	.modal-fade-leave-active {
		transition: opacity .25s ease-out;
	}

	.modal-backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;
	}

	.modal {
		background: #FFFFFF;
		box-shadow: 2px 2px 20px 1px;
		border-radius: 0.5em;
		overflow-x: auto;
		display: flex;
		flex-direction: column;
		max-height: 95vh;
		overflow: auto;
		max-width: 95%;
	}

	.modal-header,
	.modal-footer {
		padding: 15px;
		display: flex;
	}

	.modal-header {
		border-bottom: 1px solid #eeeeee;
		justify-content: space-between;
	}

	.modal-footer {
		border-top: 1px solid #eeeeee;
		justify-content: flex-end;
	}

	.modal-body {
		position: relative;
		padding: 20px 10px;
	}



</style>