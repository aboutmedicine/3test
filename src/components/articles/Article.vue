<template>
	<div class="article">
		<h4>{{content.name}}</h4>
		<p>{{content.description}}</p>

		<component :is="template" :content="content" v-if="template"/>

		<div class="tag"
		     v-for="tag in content._tags"
		     :key="tag.slug">
			<i :class="tag.icon"></i>{{tag.title}}
		</div>

		<div class="text-right">
			<small> {{content._category}} | {{type}}</small>
		</div>

	</div>
</template>

<script>
    export default {
        props: ['content', 'type'],
        data: () => ({
            template: null,
        }),
        computed: {
            /*
			* https://medium.com/scrumpy/dynamic-component-templates-with-vue-js-d9236ab183bb
			* */
            loadTemplate() {
                return () => import(`@/components/articles/templates/${this.type}`)
            },
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
            edit() {

            }
        }

    }
</script>