<template>
	<div class="article-specials">
		<p><strong>Etiology - </strong>{{content.etiology}}</p>
		<p><strong>Hx - </strong>{{content.hx}}</p>
		<p><strong>Ex - </strong>{{content.ex}}</p>
		<p><strong>Ix - </strong>{{content.ix}}</p>
		<p><strong>Mx - </strong>{{content.mx}}</p>
	</div>
</template>

<script>
	export default {
	    props: ['content'],

	}
</script>