<template>
	<div id="app" class="home" :class="mobile ? 'touch' : 'desktop'">
		<Toolbar></Toolbar>
		<Navigation></Navigation>
		<router-view/>
	</div>
</template>

<script>
	import Toolbar from '@components/Toolbar'
	import Navigation from '@components/Navigation'

	export default {
		components: {
			Toolbar,
			Navigation
		},
		data: () => ({}),
		computed: {
			mobile() {
				return this.$store.state.mobile
			}
		},
		mounted() {}
	}
</script>

<style lang="scss">
	@import '@styles/main.scss';
</style>
