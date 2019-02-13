<template>
	<component :is="layout" :class="[layout, (mobile ? 'touch' : 'desktop')]">
		<router-view/>
	</component>

</template>

<script>
	export default {
	    data: () => ({
		    template: null
	    }),
		computed: {
			mobile() {
				return this.$store.state.mobile
			},
			layout() {
			    if(this.$route.meta.layout) {
                    return `layout-${this.$route.meta.layout}`
			    }
			    else {
			        return false
			    }
			}
		},
	}
</script>

<style lang="scss">
	@import '@styles/main.scss';
</style>
