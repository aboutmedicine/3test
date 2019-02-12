<template>
	<div id="notes" class="flex-container">

		<div class="column">
			<div
			     v-for="system in systems"
			     :key="system._id"
			     :class="selected.system === system ? 'selected' : ''"
			     @click="selectSystem(system)">
				{{system.name}}
			</div>
		</div>

		<div v-if="selected.system" class="column">
			<div
			     v-for="section in sections"
			     :key="section._id"
			     :class="selected.section === section ? 'selected' : ''"
			     @click="selectSystemSection(section)">
				{{section.name}}
			</div>
		</div>

		<div v-if="selected.system && selected.section" class="column">
			<div
				v-for="article in articlesInSelection(selected)"
			     :key="article.id"
			     :class="selected.article === article ? 'selected' : ''"
			     @click="showArticle(article)"
			>
				{{article.title}}
			</div>

		</div>

		<div v-if="articlesInSelection(selected).length && selected.article && selected.article.section === selected.section.name"
		     class="column selected" style="flex-grow: 1; max-width: 44vw;">
			<div class="article">
				<h4>{{selected.article.title}}</h4>
				<p>{{selected.article.description}}</p>

				<template v-if="selected.article.type === 'pathology'">
					<p><strong>Hx - </strong>{{selected.article.hx}}</p>
					<p><strong>Ex - </strong>{{selected.article.ex}}</p>
					<p><strong>Ix - </strong>{{selected.article.ix}}</p>
					<p><strong>Mx - </strong>{{selected.article.mx}}</p>
				</template>


				<div class="tag"
				     v-for="tag in selected.article.tags"
				     :key="tag.slug">
					<i :class="tag.icon"></i>{{tag.title}}
				</div>

				<div class="text-right">
					<small> {{selected.article.system}} | {{selected.article.section}}</small>
				</div>

			</div>
		</div>

	</div>
</template>
<script>
    import { mapState, mapGetters } from 'vuex'

    export default {
        name: 'notes',
        data: () => ({
	        selected: {
	            system: '',
		        section: '',
		        article: null
	        }

        }),
        computed: {
            ...mapState('notes', [
                'systems',
                'sections',
            ]),
	        ...mapGetters('notes', [
                'articlesInSelection'
	        ]),
        },
	    created() {
            this.$httpService.getCategories().then(res => {
                this.$store.commit('notes/SET_CATEGORIES', res);
            });
	    },
        mounted() {
        },
	    methods: {
            selectSystem(entry) {
                this.selected.system = entry;
                this.selected.article = null;

            },
		    selectSystemSection(entry) {
                this.selected.section = entry;
                this.selected.article = null;
		    },
		    showArticle(entry) {
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