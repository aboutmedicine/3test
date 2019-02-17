<template>
	<div id="model-viewer">

		<Toolbar></Toolbar>

		<Sidebar>
			<h5 slot="header">{{activeModel}}</h5>
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
        data: () => ({}),
        computed: {
            mobile() {
                return this.$store.state.mobile
            },
            ...mapGetters('models', [
                'activeModel'
            ]),

        },
        mounted() {
        }
    }
</script>