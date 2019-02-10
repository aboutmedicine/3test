<template>
	<div>
		<header class="header">
			<div class="logo">
				<img id="logo" src="assets/Logo.png" height="96" width="96">
			</div>
		</header>
		<slot></slot>
	</div>
</template>

<script>
    export default {
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