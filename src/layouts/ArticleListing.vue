<template>
	<div>
		<header class="header">
			<router-link class="logo" :to="'/'">
				<img id="logo" src="assets/Logo.png" height="96" width="96">
			</router-link>
			<SearchForm></SearchForm>
			<Sidebar></Sidebar>
		</header>

		<!--router view-->
		<slot></slot>
	</div>
</template>

<script>
	import Sidebar from '@/components/navigation/Sidebar'
	import SearchForm from '@/components/search/SearchForm'

    export default {
        components: { Sidebar, SearchForm },
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