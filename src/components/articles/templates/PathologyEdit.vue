<template>
	<div class="">
		<h4>Special Fields</h4>

		<div class="fieldset">
			<label for="">
				Etiology
				<input type="text" name="etiology" placeholder="etiology" :value="content.etiology"
				       @input="handleInput"/>
			</label>
			<label for="">
				Hx
				<input type="text" name="hx" placeholder="hx" :value="content.hx"
				       @input="handleInput"/>
			</label>
			<label for="">
				Ex
				<input type="text" name="ex" placeholder="ex" :value="content.ex"
				       @input="handleInput"/>
			</label>

			<label>
				Ix
				<input type="text" name="ix" placeholder="ix" :value="content.ix"
				       @input="handleInput"/>
			</label>

			<label for="">
				Mx
				<input type="text" name="mx" placeholder="mx" :value="content.mx"
				       @input="handleInput"/>
			</label>
		</div>

	</div>
</template>

<script>
	export default {
	    props: {
	        content: {
	            type: Object,
		        default: () => ({})
	        },
	    },
		data: () => ({
		}),
		methods: {
            handleInput(event) {
                this.$emit('input', event.target.name, event.target.value);
            }
		},
	}
</script>

<style lang="scss" scoped>
</style>