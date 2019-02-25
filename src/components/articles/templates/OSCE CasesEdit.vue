<template>
	<div class="">
		<h4>Special Fields</h4>
		<div class="fieldset">
			<label for="">
				Structure
				<input type="text" name="structure" placeholder="Structure" :value="content.structure"
				       @input="handleInput"/>
			</label>
			<label for="">
				Mnemonic
				<input type="text" name="mnemonic" placeholder="Mnemonic" :value="content.mnemonic"
				       @input="handleInput"/>
			</label>
			<label for="">
				Questions
				<input type="text" name="questions" placeholder="Questions" :value="content.questions"
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
		data: () => ({}),
		methods: {
	        handleInput(event) {
	            this.$emit('input', event.target.name, event.target.value);
	        }
		}

	}
</script>

<style lang="scss" scoped>
</style>