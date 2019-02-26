<template>
	<div class="article">

		<div class="article-header">
			<h4 v-if="showTitle" class="article-title">{{content.name}}</h4>

			<!--EDIT / DELETE-->
			<slot name="actions"></slot>
		</div>

		<div class="article-excerpt">
			<p>{{content.description}}</p>
		</div>

		<div class="article-body">
			<component :is="template" :content="content.special" v-if="template"/>
			<p><strong>Notes - </strong>{{content.notes}}</p>
		</div>


		<div class="article-footer">
			<div v-for="tag in content._tags" :key="tag.title" class="tag"
			     :style="{ backgroundColor:`var(--${tag.title})`}">
				<i :class="`fas fa-${tag.icon}`"></i>{{ tag.title }}
			</div>
		</div>

		<!--<p v-if="showMeta" class="text-right">
			<small> {{content._category}} | {{content._type}}</small>
		</p>-->

	</div>
</template>

<script>
    export default {
        props: {
            content: Object,
            showTitle: {
                type: Boolean,
                default: true
            },
	        showMeta: {
                type: Boolean,
		        default: true
	        }
        },
        components: {},
        data: () => ({
            template: null,
        }),
        computed: {
            /*
			* https://medium.com/scrumpy/dynamic-component-templates-with-vue-js-d9236ab183bb
			* */
            loadTemplate() {
                return () => import(`@/components/articles/templates/${this.content._type}`)
            },
        },
        mounted() {
            this.loadTemplate()
                .then(() => {
                    this.template = () => this.loadTemplate()
                })
                .catch(() => {
                    this.template = null
                })
        },
        methods: {},
	    watch: {
            'content._type'() {
                this.template = () => this.loadTemplate()
            }
	    }

    }
</script>

<style lang="scss">
	.article {
		width: 100%;
		max-width: 800px;

		.modal & {
			width: 540px;
			max-width: 100%;
		}
		p {
			white-space: pre-wrap;
		}
		b, strong {
			font-weight: 600;
		}
		small {
			font-size: 0.5em;
		}
	}

	.article-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5em;
		.modal & {
			display: none;
		}
	}
	.article-title {
		margin: 0;
		margin-right: 1em;
		font-weight: 600;
		font-size: 1.5em;
	}

	.article-footer {
		margin-left: 0.5em;
		.tag + .tag {
			margin-left: 0.5em;
		}
	}

	.article-body {
		margin-left: 1em;
	}
	.article-excerpt {
		margin-left: 0.5em;
	}
</style>