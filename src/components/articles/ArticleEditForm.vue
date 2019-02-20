<template>
	<form ref="form" class="article-edit" @submit.prevent="update">
		<input type="text" name="name" placeholder="title" required/>
		<br>
		<input type="text" name="description" placeholder="short description"/>
		<br>
		<textarea name="notes" cols="30" rows="10" placeholder="notes"></textarea>
		<br>

		<!--dynamic component(additional field set, depends on section)-->
		<component :is="fieldSet" v-if="fieldSet" :content="content"/>

		<input type="submit" class="btn-primary" :value="action"/>

		<div>{{error}}</div>
	</form>
</template>

<script>
	export default {
	    props: {
	        articleType: String,
		    category: String,
		    content: Object,
	    },
		data: () => ({
			fieldSet: null,
			error: null,
		}),
		computed: {
            loadTemplate() {
                return () => import(`@/components/articles/templates/${this.articleType}Edit`)
            },
			action() {
                return this.content ? 'EDIT' : 'CREATE';
			}
		},
		mounted() {
	        console.log(this.content);
            this.loadTemplate()
                .then(() => {
                    this.fieldSet = () => this.loadTemplate();
                })
                .catch(() => {
                    this.fieldSet = null
                });

            this.populate();
		},
		methods: {
	        populate() {
                if(this.content) {
                    [...this.$refs.form.elements].forEach(el => {
                        console.log(el.name, this.content[el.name]);
                        if(el.name && this.content[el.name]) {
                            el.value = this.content[el.name];
                        }
                    });
                }
	        },
	        update(e) {
		        const data = {
                    _id: this.content._id,
		            _category: this.category || this.content._category,
			        type: this.articleType,

		        };

                [...e.target.elements].forEach(el => {
                    if(el.name) {
                        data[el.name] = el.value;
                    }
                });

                this.error = null;

                this.$store.dispatch(`notes/${this.action}_ARTICLE`, data)
	                .then((res) => {
	                    console.log('form', res);
                        this.$emit('done')
	                })
                    .catch( err => {
                        console.log(err);
                        this.error = err;
                    })
	        }
		},
		watch: {
	        fieldSet(next) {
	            console.log(next);
	            this.$nextTick(() => {
                    this.populate();
	            });

	        }
		}
	}
</script>

<style lang="scss">
	.article-edit {
		display: flex;
		flex-direction: column;
		max-width: 100%;
		width: 580px;
	}
</style>