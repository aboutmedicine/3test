<template>
	<div id="model-viewer">
		<Toolbar></Toolbar>
		<Navigation></Navigation>
		<slot></slot>
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