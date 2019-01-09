const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	slug: {
		type: String
	},
	url: {
		type: String
	}

}, {
	timestamps: true
});

mongoose.model('Post', PostSchema);