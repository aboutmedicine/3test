<template>
	<div class="">
		<h4>Special Fields</h4>

		<div class="fieldset">
			<label for="">
				Etiology
				<input type="text" name="etiology" placeholder="etiology" :value="content.etiology"/>
			</label>
			<label for="">
				Hx
				<input type="text" name="hx" placeholder="hx" :value="content.hx"/>
			</label>


			<label for="">
				Ex
				<input type="text" name="ex" placeholder="ex" :value="content.ex"/>
			</label>

			<label>
				Ix
				<input type="text" name="ix" placeholder="ix" :value="content.ix"/>
			</label>

			<label for="">
				Mx
				<input type="text" name="mx" placeholder="mx" :value="content.mx"/>
			</label>

		</div>


	</div>
</template>

<script>
	export default {
	    props: {
	        content: {
	            type: Object,
		        default: {}
	        },
	    },
		data: () => ({

		}),
		mounted() {

		}

	}
</script>

<style lang="scss" scoped>
	.fieldset {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		> * {
			margin-bottom: 1em;
		}
	}

	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		input {
			flex: 0 80%;
		}
	}

</style>