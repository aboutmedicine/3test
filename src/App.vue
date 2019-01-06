<template>
	<div id="app" class="home">
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
		computed: {},
		mounted() {}
	}
</script>

<style lang="scss">
	@import '@styles/main.scss';
</style>
