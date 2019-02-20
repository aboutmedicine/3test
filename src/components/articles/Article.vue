<template>
	<div class="article">

		<div class="article-header">
			<h4 v-if="showTitle">{{content.name}}</h4>
			<div class="btn-row">
				<button v-if="user" class="btn-primary btn-sm" @click="isEditMode = true">
					Edit
				</button>
				<button v-if="user" class="btn-accent btn-sm" @click="dialog.delete = true">
					Delete
				</button>
			</div>

		</div>

		<p>{{content.description}}</p>

		<component :is="template" :content="content" v-if="template"/>

		<p>{{content.notes}}</p>

		<div class="tag"
		     v-for="tag in content._tags"
		     :key="tag.slug">
			<i :class="tag.icon"></i>{{tag.title}}
		</div>

		<app-modal v-if="isEditMode" @close="isEditMode = false">
			<h3 slot="header" class="title">Edit {{content.name}}</h3>
			<ArticleEditForm
					slot="body"
					:content="content"
					:articleType="articleType"
					:category="content._category"
					@done="isEditMode = false"
			></ArticleEditForm>
			<div slot="footer" class="text-right">
				<small> {{content._category}} | {{articleType}}</small>
			</div>
		</app-modal>

		<app-modal v-if="dialog.delete" @close="dialog.delete = false">
			<h3 slot="header" class="title">Delete {{content.name}}?</h3>
			<div slot="body" class="btn-row">
				<button class="btn-accent" @click="remove" :disabled="isPending">Delete</button>
				<button class="btn-primary" @click="dialog.delete = false">Cancel</button>
			</div>
			<div slot="footer" v-if="error">{{error}}</div>
		</app-modal>
	</div>
</template>

<script>
    import ArticleEditForm from '@/components/articles/ArticleEditForm'

    import { mapState, mapActions } from 'vuex';

    export default {
        props: {
            content: Object,
            articleType: String,
            showTitle: {
                type: Boolean,
                default: true
            }
        },
        components: { ArticleEditForm },
        data: () => ({
            template: null,
            isEditMode: false,
            isPending: false,
            dialog: {
                delete: false,
            },
            error: null
        }),
        computed: {
            /*
			* https://medium.com/scrumpy/dynamic-component-templates-with-vue-js-d9236ab183bb
			* */
            loadTemplate() {
                return () => import(`@/components/articles/templates/${this.articleType}`)
            },
            ...mapState([
                'user'
            ])
        },
        mounted() {
            console.log(this.content);

            this.loadTemplate()
                .then(() => {
                    this.template = () => this.loadTemplate()
                })
                .catch(() => {
                    this.template = null
                })
        },
        methods: {
            ...mapActions('notes', [
                'DELETE_ARTICLE',
                'EDIT_ARTICLE'
            ]),
            edit() {

            },
            remove() {
                this.isPending = true;
                this.error = null;
                this.DELETE_ARTICLE({ type: this.articleType, ...this.content })
                    .then(() => {
                        this.dialog.delete = false;
                        this.isPending = false;
                        this.$emit('deleted');
                    })
                    .catch(err => {
                        this.error = err;
                    });
            }
        }

    }
</script>

<style lang="scss">
	.article {

	}

	.article-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>