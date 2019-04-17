<template>
	<component :is="layout" :class="[layout, (mobile ? 'touch' : 'desktop')]">
        <a class="feedback-btn" target="_blank" href="https://aboutmedicine.typeform.com/to/qX1p8S">Feedback</a>
		
		<router-view/>

		<portal-target name="modals-portal">
			<!-- The modal will be rendered here
		       Positioned ad the end of the page to be
		       easily positioned absolutely to the body element
		  -->
		</portal-target>
	</component>

</template>

<script>
    export default {
        data: () => ({}),
        components: {},
        computed: {
            mobile() {
                return this.$store.state.mobile
            },
            layout() {
                if (this.$route.meta.layout) {
                    return `layout-${this.$route.meta.layout}`
                }
                else {
                    return false
                }
            }
        },
	    created() {
            this.$store.dispatch('AUTH_STATUS');
	    }
    }
</script>

<style lang="scss">
	@import '@styles/main.scss';
    .feedback-btn {
		position: fixed;
		bottom: 0px;
		left: 15px;
		padding: 10px;
		border-radius: 20px 20px 0px 0px;
		background-color: rgba(0, 0, 0, 0.02);
		cursor: pointer;
		transition: 0s;
		text-decoration: none;
		color: #333;
        z-index: 1;
		&:hover {
			background-color: rgba(0, 0, 0, 0.08);
		}
	}
</style>
