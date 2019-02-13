<template>
	<div id="notes" class="flex-container">

		<!--CATEGORIES (SYSTEMS)-->
		<div class="column column--sm">
			<div
					v-for="system in systems"
					:key="system._id"
					:class="selected.system === system.name ? 'selected' : ''"
					@click="selectCategory(system)">
				{{system.name}}
			</div>
		</div>

		<!--ARTICLE TYPES (SYSTEM SECTIONS)-->
		<div v-if="selected.system" class="column column--sm">
			<div
					v-for="section in sections"
					:key="section._id"
					:class="selected.section === section.name ? 'selected' : ''"
					@click="selectArticleType(section)">
				{{section.name}}
			</div>
		</div>

		<!--ARTICLES IN COLLECTION (CATEGORY + TYPE)-->
		<div v-if="selected.system && selected.section" class="column column--md">
			<div
					v-for="article in articlesInSelection(selected)"
					:key="article._id"
					:class="selected.article === article ? 'selected' : ''"
					@click="selectArticle(article)"
			>
				{{article.name}}
			</div>

		</div>

		<!--ARTICLE-->
		<div v-if="selected.article"
		     class="column selected" style="flex: 1;">
			<Article :content="selected.article" :type="selected.section"></Article>
		</div>

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
            selected: {
                system: '',
                section: '',
                article: null
            },
        }),
        computed: {
            ...mapState('notes', [
                'systems',
                'sections',
                'articles'
            ]),
            ...mapGetters('notes', [
                'articlesInSelection'
            ]),
        },
        created() {
            HttpService.getCategories().then(res => {
                this.$store.commit('notes/SET_CATEGORIES', res);
            });
        },
        mounted() {
        },
        methods: {
            ...mapActions('notes', [
                'FETCH_ARTICLES_IN_SELECTION'
            ]),
            selectCategory(entry) {
                this.selected.system = entry.name;
                this.selected.article = null;

                //fetch articles if needed
                if (this.selected.section &&
	                !this.articles[this.selected.system][this.selected.section].length) {

                    this.FETCH_ARTICLES_IN_SELECTION({
                        category: entry.name,
                        type: this.selected.section,
                    });
                }
            },
            selectArticleType(entry) {
                this.selected.section = entry.name;
                this.selected.article = null;

                //fetch articles if needed
                if (!this.articles[this.selected.system][this.selected.section].length) {
                    this.FETCH_ARTICLES_IN_SELECTION({
                        category: this.selected.system,
                        type: entry.name
                    });
                }
            },
            selectArticle(entry) {
                this.selected.article = entry;
            }
        }
    }
</script>

<style lang="scss" scoped>

	#notes {
		height: calc(100vh - 150px);
		overflow: hidden;
		position: relative;
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