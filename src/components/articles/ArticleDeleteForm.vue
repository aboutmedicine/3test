<template>
	<div>
		<p v-if="error">{{error}}</p>

		<div class="btn-row">
			<button class="btn-accent" @click="deleteArticle" :disabled="isPending">
				Delete
			</button>
			<button class="btn-primary" @click="$emit('done')">
				Cancel
			</button>
		</div>
	</div>

</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        props: {
			article: {
                type: Object,
            }
        },
        data: () => ({
            isPending: false,
	        error: null
        }),
        methods: {
            ...mapActions('notes', [
                'DELETE_ARTICLE',
            ]),
            deleteArticle() {
                this.isPending = true;
                this.error = null;

                this.DELETE_ARTICLE(this.article)
                    .then(() => {
                        this.isPending = false;
                        this.$emit('done');
                    })
                    .catch(err => {
                        this.error = err;
                    });
            }
        }
    }
</script>