<template>
	<component :is="layout" :class="[layout, (mobile ? 'touch' : 'desktop')]">
		<router-view/>
	</component>
</template>

<script>
	export default {
		computed: {
			mobile() {
				return this.$store.state.mobile
			},
			layout() {
				return `layout-${this.$route.meta.layout}`
			}
		},
	}
</script>

<style lang="scss">
	@import '@styles/main.scss';
</style>
