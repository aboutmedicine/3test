<template>
	<div id="notes">
		<!--visible from 768-->
		<mq-layout mq="md+" class="flex-container" id="desktop-notes">
			<!--CATEGORIES (SYSTEMS)-->
			<div class="column column--sm">

				<div
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
						v-for="section in sections"
						:key="section._id"
						:class="taxonomy.section && taxonomy.section.name === section.name ? 'selected' : ''"
						@click="selectArticleType(section)">
					{{section.name}}
				</div>
			</div>

			<!--ARTICLES IN COLLECTION (CATEGORY + TYPE)-->
			<div  v-if="validSelection" class="column column--md">
				<div
						v-for="article in articlesInSelection(taxonomy)"
						:key="article._id"
						:class="selectedArticle && selectedArticle.name === article.name ? 'selected' : ''"
						@click="selectArticle(article)"
				>
					{{article.name}}
				</div>

			</div>

			<!--ARTICLE-->
			<div v-if="selectedArticle"
			     class="column selected" style="flex: 1;">
				<Article
						:content="selectedArticle"
						:type="taxonomy.section.name"></Article>
			</div>
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
						v-for="article in articlesInSelection(taxonomy)"
						:key="article._id"
						:class="selectedArticle === article ? 'selected' : ''"
						@click="selectArticle(article)"
				>
					{{article.name}}
				</div>

			</div>

			<app-modal v-if="selectedArticle" @close="selectedArticle = null">
				<Article slot="body"
				         :content="selectedArticle"
				         :type="taxonomy.section.name"></Article>
			</app-modal>
		</mq-layout>

	</div>
</template>
<script>
    import { mapState, mapActions, mapGetters } from 'vuex'
    import Article from '@/components/articles/Article'
    import { HttpService } from '@/http';

    export default {
        name: 'notes',
        components: { Article },
        data: () => ({
            selectedArticle: null,
            taxonomy: {
                system: null,
                section: null
            }
        }),
        computed: {
            ...mapState([
                'theme'
            ]),
            ...mapState('notes', [
                'systems',
                'sections',
                'articles',
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
                this.$store.commit('notes/SET_CATEGORIES', res);
            });
        },
        methods: {
            ...mapActions('notes', [
                'FETCH_ARTICLES_IN_SELECTION'
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
                this.selectedArticle = entry;
            },
            requestArticles() {
                if (this.validSelection && !this.articlesInSelection(this.taxonomy).length) {

                    this.FETCH_ARTICLES_IN_SELECTION({
                        category: this.taxonomy.system.name,
                        type: this.taxonomy.section.name,
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
                this.$nextTick( () => {
                    this.selectedArticle = null;
                    this.requestArticles();
                });

            },
            'taxonomy.section'() {
                this.$nextTick( () => {
                    this.selectedArticle = null;
                    this.requestArticles();
                });
            }
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
			background-color: #fcfcfc;
			color: #444;
			min-width: 100px;
			margin: .5em;
			padding: .5em;
			text-align: left;
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

	}

	.article {
		small {
			font-size: 0.5em;
		}
	}

	.tag {
		display: inline-block;
		background-color: #99d9f5;
		margin: .5em;
		padding: .5em;
		text-align: left;
		font-size: 0.75rem;
		border-radius: .3em;
		cursor: pointer;
		color: #fff;
		i {
			margin-right: 0.5em;
		}

	}

	h4 {
		font-weight: 600;
		margin: .5em;
		font-size: 1.5em;
	}
</style>