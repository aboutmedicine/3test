<template>
	<div class="article">

		<div class="article-header">
			<h4 v-if="showTitle">{{content.name}}</h4>

			<!--EDIT / DELETE-->
			<slot name="actions"></slot>
		</div>

		<p>{{content.description}}</p>
		<p><strong>Notes - </strong>{{content.notes}}</p>

		<component :is="template" :content="content.special" v-if="template"/>

		<div class="article-footer">
			<div v-for="tag in content._tags" :key="tag.title" class="tag"
			     :style="{ backgroundColor:`var(--${tag.title})`}">
				<i :class="`fas fa-${tag.icon}`"></i>{{ tag.title }}
			</div>
		</div>

		<p v-if="showMeta" class="text-right">
			<small> {{content._category}} | {{content._type}}</small>
		</p>

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
		width: 540px;
		max-width: 100%;
		p {
			white-space: pre-wrap;
		}
	}

	.article-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.article-footer {
		.tag + .tag {
			margin-left: 0.5em;
		}
	}
</style>