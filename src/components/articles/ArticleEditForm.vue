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

		<v-select multiple label="title" v-model="localTags" placeholder="Tags" :options="tags">
			<template slot="option" slot-scope="option">
				<span class="tag-option">
					<i :class="`fas fa-${option.icon}`"></i>
					{{ option.title }}
				</span>
			</template>
		</v-select>

		<br>

		<input type="submit" class="btn-primary" :value="action"/>

		<div>{{error}}</div>
	</form>
</template>

<script>
    import { mapActions, mapState } from 'vuex';

    export default {
        props: {
            articleType: String,
            category: String,
            content: Object,
        },
        data: () => ({
            fieldSet: null,
            error: null,
	        localTags: []
        }),
        computed: {
            ...mapState('notes', [
                'tags'
            ]),
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
            ...mapActions('notes', [
                'EDIT_ARTICLE',
                'CREATE_ARTICLE'
            ]),
            populate() {
                if (this.content) {
                    [...this.$refs.form.elements].forEach(el => {
                        // console.log(el.name, this.content[el.name]);
                        if (el.name && this.content[el.name]) {
                            el.value = this.content[el.name];
                        }
                    });
                    this.localTags = JSON.parse(JSON.stringify(this.content._tags));
                }
            },
            update(e) {
                const data = {
                    _type: this.articleType,
	                _tags: this.localTags
                };

                if (this.content) {
                    data._id = this.content._id;
                    data._category = this.content._category;
                }
                else {
                    data._category = this.category
                }

                [...e.target.elements].forEach(el => {
                    if (el.name) {
                        data[el.name] = el.value;
                    }
                });

                this.error = null;

                this[`${this.action}_ARTICLE`](data)
                    .then((res) => {
                        console.log('form', res);

                        this.$emit('done')
                    })
                    .catch(err => {
                        console.log(err);
                        this.error = err;
                    })
            }
        },
        watch: {
            fieldSet() {
                this.populate();
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