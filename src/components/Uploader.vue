<template>
	<div class="container">

		<!--UPLOAD-->
		<form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving" @submit.prevent="save">
			<h4>Upload Model</h4>
			<p>
				<input type="text" name="title" placeholder="Title" v-model="upload.title">
			</p>
			<div class="dropbox">
				<input type="file"
				       name="file"
				       :disabled="isSaving"
				       @change="filesChange($event.target.name, $event.target.files)"
				       class="input-file"
				>
				<p v-if="isInitial">
					{{upload.file.name ? upload.file.name : 'Drag your file here or click to browse'}}
				</p>
				<p v-if="isSaving">
					Uploading files...
				</p>
			</div>
			<button type="button" @click="save" :disabled="!upload.title">Save</button>
		</form>
		<!--SUCCESS-->
		<div v-if="isSuccess">
			<h2>Uploaded file(s) successfully.</h2>
			<p>
				<a href="javascript:void(0)" @click="reset()">Upload again</a>
			</p>
			<ul class="list-unstyled">

			</ul>
		</div>
		<!--FAILED-->
		<div v-if="isFailed">
			<h2>Uploaded failed.</h2>
			<p>
				<a href="javascript:void(0)" @click="reset()">Try again</a>
			</p>
			<pre>{{ uploadError }}</pre>
		</div>
	</div>
</template>

<!-- Javascript -->
<script>
	import { HttpService } from '@/http'

	const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

	export default {
		name: 'app',
		data() {
			return {
				uploadError: null,
				currentStatus: null,
				upload: {
					title: '',
					file: {
						name: '',
						data: null
					}
				}
			}
		},
		computed: {
			isInitial() {
				return this.currentStatus === STATUS_INITIAL;
			},
			isSaving() {
				return this.currentStatus === STATUS_SAVING;
			},
			isSuccess() {
				return this.currentStatus === STATUS_SUCCESS;
			},
			isFailed() {
				return this.currentStatus === STATUS_FAILED;
			}
		},
		methods: {
			reset() {
				// reset form to initial state
				this.currentStatus = STATUS_INITIAL;
				this.uploadError = null;

			},
			save() {
				// upload data to the server
				this.currentStatus = STATUS_SAVING;

				const formData = new FormData();

				formData.append('title', this.upload.title);
				formData.append('file', this.upload.file.data, this.upload.file.name);

				HttpService.createPost(formData)
					.then(res => {
						this.currentStatus = STATUS_SUCCESS;
						//save in store and redirect
						this.$store.commit('models/ADD_MODEL', res.data);
						this.$router.push(res.data.slug);
					})
					.catch(err => {
						this.uploadError = err.response.data.message;
						this.currentStatus = STATUS_FAILED;
					});
			},
			filesChange(fieldName, fileList) {
				// handle file changes
				if (!fileList.length) return;

				this.upload.file.data = fileList[0];
				this.upload.file.name = fileList[0].name;
			},
		},
		mounted() {
			this.reset();
		},
	}
</script>

<!-- SASS styling -->
<style lang="scss" scoped>

	button {
		border: 2px solid #eee;
		padding: 10px 15px;
		border-radius: 0.5em;
		font-weight: bold;
		cursor: pointer;
		&[disabled] {
			opacity: 0.5;
		}
	}
	.container {
		min-width: 400px;
	}
	.dropbox {
		outline: 2px dashed grey; /* the dash box */
		outline-offset: -10px;
		background: lightcyan;
		color: dimgray;
		padding: 10px 10px;
		min-height: 200px; /* minimum height */

		position: relative;
		cursor: pointer;
	}

	.input-file {
		opacity: 0; /* invisible but it's there! */
		width: 100%;
		height: 200px;
		position: absolute;
		cursor: pointer;
	}

	.dropbox:hover {
		background: lightblue; /* when mouse over to the drop zone, change color */
	}

	.dropbox p {
		text-align: center;
		padding: 50px 0;
	}
</style>