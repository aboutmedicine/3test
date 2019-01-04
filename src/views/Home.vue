<template>
	<div class="home">
		<canvas id="tester"></canvas>

		<div class="logo">
			<img id="logo" src="assets/logo.png" height="96" width="96">
		</div>


		<div class="toolbar">

			<div id="dissect" class="toolbar-button">
				<i class="fa fa-scalpel"></i>
			</div>

			<div id="toolbar" class="toolbar-button knife">
				<i class="fa fa-cut"></i>

				<div class="toolbar-dropdown">
					<div class="toolbar-button">
						<i class="fa fa-square"></i>
					</div>
					<div class="toolbar-button">
						<i class="fa fa-minus"></i>
					</div>
					<div class="toolbar-button">
						<i style="transform: rotate(90deg)" class="fa fa-minus"></i>
					</div>
				</div>
			</div>

			<div id="annotation" class="toolbar-button">
				<i class="fa fa-file-medical"></i>
			</div>

			<div class="toolbar-button">
				<i class="fa fa-pencil"></i>
			</div>

			<div id="restore" class="toolbar-button">
				<i class="fa fa-redo-alt"></i>
			</div>

		</div>

		<div class="toolbar-social">

			<a href="http://ko-fi.com/reubenschmidt" class="social-button">
				<i class="fas fa-coffee"></i>
			</a>

		</div>

		<div id="open-sidenav" class="sidenav-button">
			<i class="fa fa-bars"></i>
		</div>

		<div id="sidenav" class="sidenav">
			<div id="close-sidenav" class="sidenav-button">
				<i class="fa fa-times"></i>
			</div>

			<div class="header">
				<h5> Model Name </h5>
			</div>
			<a class="dropdown-btn">Other Models
				<i class="sidenav-icon fa fa-caret-down"></i>
			</a>
			<div class="dropdown-container">
				<a href="#">Axilla</a>
				<a href="#">Inguinal Canal</a>
				<a href="#">Perineum</a>
			</div>
			<a id="night-mode" href="#">Night Mode
			</a>
			<a href="#">Feedback</a>
		</div>

		<h3 id="mesh-name" class="mesh-name"></h3>

	</div>
</template>

<script>
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'

	export default {
		name: 'home',
		components: {
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>