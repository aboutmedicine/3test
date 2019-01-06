<template>
	<div>
		<div class="logo">
			<img id="logo" :src="logo" height="96" width="96">
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

	</div>
</template>

<script>
	export default {
		computed: {
			logo() { return this.$theme.dark ? 'assets/Logo_Night.png' : 'assets/Logo.png' },
			controller() { return this.$store.state.controller }
		},
		mounted() {
			const controller = this.controller;



		}
	}
</script>