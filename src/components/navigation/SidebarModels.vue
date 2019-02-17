<template>
	<div class="nav-models">
		<a class="dropdown-btn" @click="dropdown.model = !dropdown.model">
			Other Models
			<i class="sidenav-icon fa fa-caret-down"></i>
		</a>
		<div class="dropdown-container" v-show="dropdown.model">
			<template v-for="model in modelList" >
				<router-link :key="model.slug" :to="model.slug">
					{{model.title}}
				</router-link>
			</template>
		</div>
	</div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex'

    export default {
        data: () => ({
            dropdown: {
                model: false
            }
        }),
        computed: {
            ...mapState('models', [
                'models',
            ]),
            ...mapGetters('models', [
                'sortedModels',
            ]),
            modelList() {
                return this.sortedModels.filter(x => x.slug !== this.$route.params.id)
            },

        },
    }
</script>

<style lang="scss">
	.sidenav .header {
		padding: 24px 8px 8px 16px;
		margin: 0;
		text-decoration: none;
		display: block;
		font-size: 32px;
	}

	.dropdown-container {
		padding-left: 8px;
		max-height: 40vh;
		overflow: auto;
	}

</style>