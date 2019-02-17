<template>
	<component :is="layout" :class="[layout, (mobile ? 'touch' : 'desktop')]">
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


</style>
