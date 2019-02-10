<template>
	<div id="notes" class="flex-container">

		<div>
			<div class="column" id="selected">Anatomy</div>
			<div class="column">Physiology</div>
			<div class="column">Pathology</div>
		</div>
		<div>
			<div class="column">Dorsal Column Pathway</div>
			<div class="column" id="selected">Medial Lemniscus</div>
			<div class="column">Spinocerebellar Tract</div>
			<div class="column">Synapse</div>
		</div>
		<div>
			<div class="column">
				<h4>Medial Lemniscus</h4>
				<p>The medial lemniscus joins the spinal cord to the thalamus. It is a pathway used by the fastest
					sensory nerves in the body.</p>
			</div>

		</div>

	</div>
</template>
<script>
    export default {
        name: 'notes',
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
	.flex-container {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		> img {
			margin: .8em;
		}
	}
	.column:hover {
		background-color: #f8f8f8;
	}

	.column {
		background-color: #fcfcfc;
		color: #444;
		min-width: 100px;
		margin: .5em;
		padding: .5em;
		text-align: left;
		font-size: 1rem;
		border-radius: .3em;
	}

	#selected {
		background-color: #ddd;
	}

	h4 {
		font-weight: 600;
		margin: .5em;
		font-size: 1.5em;
	}

	i {
		color: #888;
		width: 15px;
		margin-right: 15px;
	}


</style>