<template>
	<div class="nav-models">
		<a class="dropdown-btn" @click="dropdown.model = !dropdown.model">
			Other Models
      <i v-if="!dropdown.model" class="sidenav-icon fa fa-caret-down"></i>
      <i v-if="dropdown.model" class="sidenav-icon fa fa-caret-up"></i>
		</a>
		<div class="dropdown-container" v-show="dropdown.model">
			<template v-for="model in modelList" >
				<router-link :key="model.slug" :to="model.slug">
					{{model.title}}
				</router-link>
			</template>
		</div>
		<a id="night-mode" @click="$store.commit('TOGGLE_THEME')">
			{{ $theme.dark ? 'Day' : 'Night'}} Mode
		</a>
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
    padding: 20px 0px 0px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown-container {
     padding-left: 16px;
     overflow: auto;
   }

</style>