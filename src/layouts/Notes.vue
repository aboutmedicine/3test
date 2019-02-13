<template>
	<div>
		<header class="header">
			<router-link class="logo" :to="'/'">
				<img id="logo" src="assets/Logo.png" height="96" width="96">
			</router-link>
		</header>
		<slot></slot>
	</div>
</template>

<script>
    export default {
        name: 'layout-notes',
        components: {},
        data: () => ({}),
        computed: {
        },
        mounted() {}
    }
</script>

<style lang="scss">
	.header {
		position: relative;
		padding: 15px;
		margin-bottom: 5px;
		display: flex;
	}
</style>