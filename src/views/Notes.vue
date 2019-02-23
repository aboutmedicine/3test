<template>
	<div id="notes">
		<!--visible from 768-->
		<mq-layout mq="md+" class="flex-container" id="desktop-notes">
			<!--CATEGORIES (SYSTEMS)-->
			<div class="column column--sm">

				<div
						class="article-list-item"
						v-for="system in systems"
						:key="system._id"
						:class="taxonomy.system && taxonomy.system.name === system.name ? 'selected' : ''"
						@click="selectCategory(system)">
					{{system.name}}
				</div>
			</div>

			<!--ARTICLE TYPES (SYSTEM SECTIONS)-->
			<div class="column column--sm">
				<div
						class="article-list-item"
						v-for="section in sections"
						:key="section._id"
						:class="taxonomy.section && taxonomy.section.name === section.name ? 'selected' : ''"
						@click="selectArticleType(section)">
					{{section.name}}
				</div>
			</div>

			<!--ARTICLES IN COLLECTION (CATEGORY + TYPE)-->
			<div v-if="validSelection" class="column column--md">
				<div v-if="user">
					<button class="btn-block btn-primary" @click="dialog.create = true">
						<i class="fas fa-plus"></i>
					</button>
				</div>

				<div class="article-list-item"
				     v-for="article in articlesInSelection(taxonomy)"
				     :key="article._id"
				     :class="selectedArticle && selectedArticle.name === article.name ? 'selected' : ''"
				     @click="selectArticle(article)"
				>
					{{article.name}}
				</div>

			</div>

			<!--ARTICLE-->
			<div v-if="validSelection && selectedArticle" class="column" style="flex: 1;">
				<Article
						:content="selectedArticle"
						:articleType="taxonomy.section.name"
				>
					<div slot="actions" class="btn-row" v-if="user">
						<button class="btn-primary btn-sm" @click="dialog.edit = true">
							Edit
						</button>
						<button class="btn-accent btn-sm" @click="dialog.delete = true">
							Delete
						</button>
					</div>
				</Article>

				<app-modal v-if="dialog.edit" @close="dialog.edit = false">
					<h3 slot="header" class="title" v-if="selectedArticle">Edit {{selectedArticle.name}}</h3>

					<ArticleEditForm
							slot="body"
							:content="selectedArticle"
							:articleType="taxonomy.section.name"
							@done="dialog.edit = false"
					></ArticleEditForm>

					<div slot="footer" class="text-right">
						<small> {{selectedArticle._category}} | {{taxonomy.section.name}}</small>
					</div>
				</app-modal>

				<app-modal v-if="dialog.delete" @close="dialog.delete = false">
					<h3 slot="header" class="title" v-if="selectedArticle">Delete {{selectedArticle.name}}?</h3>

					<ArticleDeleteForm
							slot="body"
							@done="dialog.delete = false"
							:article="selectedArticle"
					></ArticleDeleteForm>

					<div slot="footer" v-if="error">{{error}}</div>
				</app-modal>
			</div>

			<app-modal v-if="dialog.create" @close="dialog.create = false">
				<h3 slot="header" class="title" >New {{taxonomy.section.name}} Article</h3>

				<ArticleEditForm slot="body"
				                 :category="taxonomy.system.name"
				                 :articleType="taxonomy.section.name"
				                 @done="dialog.create = false"
				></ArticleEditForm>

				<div slot="footer" class="text-right">
					<small> {{taxonomy.system.name}} | {{taxonomy.section.name}}</small>
				</div>
			</app-modal>



		</mq-layout>


		<!--visible till 767-->
		<mq-layout :mq="['xs', 'sm']" class="container">
			<v-select label="name"
			          :options="systems"
			          v-model="taxonomy.system"
			          placeholder="System"
			>
			</v-select>
			<hr>
			<v-select label="name"
			          :options="sections"
			          v-model="taxonomy.section"
			          placeholder="Section"
			>
			</v-select>

			<div v-if="validSelection" class="column column--md">
				<div
						class="article-list-item"
						v-for="article in articlesInSelection(taxonomy)"
						:key="article._id"
						:class="selectedArticle === article ? 'selected' : ''"
						@click="selectArticle(article)"
				>
					{{article.name}}
				</div>

				<app-modal v-if="selectedArticle" @close="selectArticle(null)">
					<h3 slot="header" class="title">{{selectedArticle.name}}</h3>

					<Article slot="body"
					         :content="selectedArticle"
					         :articleType="taxonomy.section.name"
					         :showTitle="false"
					></Article>

					<div slot="footer" class="text-right">
						<small> {{taxonomy.system.name}} | {{taxonomy.section.name}}</small>
					</div>
				</app-modal>

			</div>


		</mq-layout>

	</div>
</template>
<script>
    import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
    import { HttpService } from '@/http';
    import Article from '@/components/articles/Article'
    import ArticleEditForm from '@/components/articles/ArticleEditForm'
    import ArticleDeleteForm from '@/components/articles/ArticleDeleteForm'


    export default {
        name: 'notes',
        components: { Article, ArticleEditForm, ArticleDeleteForm },
        data: () => ({
            taxonomy: {
                system: null,
                section: null
            },
            dialog: {
                create: false,
                delete: false,
                edit: false
            },
            error: null
        }),
        computed: {
            ...mapState([
                'theme',
                'user'
            ]),
            ...mapState('notes', [
                'systems',
                'sections',
                'articles',
                'selectedArticle'
            ]),
            ...mapGetters('notes', [
                'articlesInSelection'
            ]),
            validSelection() {
                return this.taxonomy.system && this.taxonomy.section;
            },
        },
        created() {
            HttpService.getCategories().then(res => {
                this.SET_CATEGORIES(res);
            });
        },
        methods: {
            ...mapMutations('notes', [
                'SELECT_ARTICLE',
                'SET_CATEGORIES',
            ]),
            ...mapActions('notes', [
                'FETCH_ARTICLES_IN_SELECTION',
            ]),
            selectCategory(entry) {
                if (!entry) return;
                this.taxonomy.system = entry;
            },
            selectArticleType(entry) {
                if (!entry) return;
                this.taxonomy.section = entry;
            },
            selectArticle(entry) {
                console.log(this.validSelection);
                if(!this.validSelection) return;
                
                this.SELECT_ARTICLE(entry ? {
	                _type: this.taxonomy.section.name,
	                ...entry
                } : null);
            },
            requestArticles() {
                if (this.validSelection && !this.articlesInSelection(this.taxonomy).length) {

                    this.FETCH_ARTICLES_IN_SELECTION({
                        _category: this.taxonomy.system.name,
                        _type: this.taxonomy.section.name,
                    });
                }

            },
        },
        watch: {
            'theme.dark'(to) {
                console.log(to);
                document.body.style.backgroundColor = to ? '#333333' : '#ffffff';
            },
            'taxonomy.system'() {
                this.$nextTick(() => {
                    this.SELECT_ARTICLE(null);
                    this.requestArticles();
                });

            },
            'taxonomy.section'() {
                this.$nextTick(() => {
                    this.SELECT_ARTICLE(null);
                    this.requestArticles();
                });
            },
        }
    }
</script>

<style lang="scss" scoped>

	#desktop-notes {
		height: calc(100vh - 150px);
		overflow: hidden;
		position: relative;
	}

	.container {
		padding: 15px;
	}

	.flex-container {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		> img {
			margin: .8em;
		}
	}

	.column {
		height: 100%;
		overflow: auto;
		&--sm {
			flex: 0 180px;
		}
		&--md {
			flex: 0 220px;
		}
		> * {
			margin: .5em;
		}
		.article {
			width: auto;
			background-color: #fcfcfc;
			border-radius: .3em;
			padding: .5em;
		}

	}

	.article-list-item {
		background-color: #fcfcfc;
		color: #444;
		min-width: 100px;
		text-align: left;
		padding: .5em;
		font-size: 1rem;
		border-radius: .3em;
		cursor: pointer;
		&:hover {
			background-color: #f8f8f8;
		}
		&.selected {
			background-color: #ddd;
		}
	}

	.article {
		width: 100%;
		max-width: 800px;
		small {
			font-size: 0.5em;
		}
		.modal & {
			width: 540px;
			max-width: 100%;
		}
	}

	h4 {
		font-weight: 600;
		margin: .5em;
		font-size: 1.5em;
	}
</style>