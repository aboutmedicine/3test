<template>
	<nav class="nav-primary">
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
			<a href="mailto:contact@aboutmedicine.com.au">Feedback</a>
		</div>
	</nav>

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

<style lang="scss">

	.sidenav-button {
		position: absolute;
		color: #ccc;
		top: 36px;
		right: 8px;
		width: 48px;
		height: 48px;
		font-size: 32px;
		margin: 0px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: .2s;
		z-index: 1;
	}

	.sidenav-button:hover,
	.sidenav a:hover {
		color: var(--black);
		cursor: pointer;
	}


	.sidenav {
		height: 100%;
		width: 0px;
		position: fixed;
		z-index: 1;
		top: 0;
		right: 0;
		background-color: #fff;
		overflow: hidden;
		transition: 0.2s;
		border-left: 2px solid #eeeeee;
	}

	.sidenav a {
		padding: 8px 28px 8px 16px;
		text-decoration: none;
		font-size: 16px;
		color: var(--dark-grey);
		display: block;
		transition: 0.2s;
		font-weight: 500;
		overflow: hidden;
		min-width: 240px;
	}

	.sidenav-icon {
		float: right;
	}

	.sidenav .header {
		padding: 24px 8px 8px 16px;
		margin: none;
		text-decoration: none;
		display: block;
		font-size: 32px;
	}

	.dropdown-container {
		padding-left: 8px;
	}

</style>