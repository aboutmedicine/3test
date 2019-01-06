<template>
	<div>
		<div id="open-sidenav" class="sidenav-button" @click="open = true">
			<i class="fa fa-bars"></i>
		</div>

		<div id="sidenav" class="sidenav" :style="`width: ${open ? '250px' : '0px'}`">
			<div id="close-sidenav" class="sidenav-button" @click="open = false">
				<i class="fa fa-times"></i>
			</div>
			<div class="header">
				<h5>{{$route.params.id || 'No model selected'}}</h5>
			</div>
			<a class="dropdown-btn" @click="dropdown.model = !dropdown.model">
				Other Models
				<i class="sidenav-icon fa fa-caret-down"></i>
			</a>
			<div class="dropdown-container" v-show="dropdown.model">
				<router-link :to="'Eye_Anatomy_draco'">Eye_Anatomy_draco</router-link>
				<router-link :to="'Axilla_draco'">Axilla_dracol</router-link>
				<router-link :to="'Test'">Test</router-link>
			</div>
			<a id="night-mode" @click="$store.commit('toggleTheme')">
				{{ $theme.dark ? 'Day' : 'Night'}} Mode
			</a>
			<a href="#">Feedback</a>
		</div>
	</div>

</template>

<script>
	export default {
		data: () => ({
			open: false,
			dropdown: {
				model: false
			}
		}),
		mounted() {},
		methods: {},
	}
</script>