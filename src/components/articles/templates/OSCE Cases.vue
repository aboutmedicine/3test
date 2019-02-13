<template>
	<div>
		<p><strong>Structure - </strong>{{content.structure}}</p>
		<p><strong>Mnemonic - </strong>{{content.mnemonic}}</p>
		<p><strong>Questions - </strong>{{content.questions}}</p>
	</div>
</template>

<script>
	export default {
	    props: ['content'],

	}
</script>