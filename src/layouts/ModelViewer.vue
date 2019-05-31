<template>
	<div id="model-viewer">

		<Toolbar></Toolbar>

		<Sidebar>
			<h4 slot="header">{{activeModel}}</h4>
			<SidebarModels slot="items"></SidebarModels>
			<SidebarModels slot="items"></SidebarModels>
		</Sidebar>

		<!--router view-->
		<slot></slot>

	</div>
</template>

<script>
    import { mapGetters } from 'vuex'

    import Toolbar from '@components/Toolbar'
    import Sidebar from '@components/navigation/Sidebar'
    import SidebarModels from '@components/navigation/SidebarModels'

    export default {
        components: {
            Toolbar,
            Sidebar,
            SidebarModels
        },
        computed: {
            mobile() {
                return this.$store.state.mobile
            },
            ...mapGetters('models', [
                'activeModel'
            ]),
        },
    }
</script>