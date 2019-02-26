const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});
const generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.path('password').set(generateHash);

UserSchema.methods.checkPassword = function (password) {
    console.log(password, this.password);
    return bcrypt.compareSync(password, this.password);
};
mongoose.model('User', UserSchema);


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


const SystemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {});
mongoose.model('System', SystemSchema);


const SectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, {});
mongoose.model('Section', SectionSchema);


const TagSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    icon: {
        type: String
    }
});

mongoose.model('Tag', TagSchema);

const ArticleSchema = new mongoose.Schema({

    //general
    name: { type: String, required: true },
    description: { type: String, required: false },
    notes: { type: String, required: false },

    //post type specific
    special: mongoose.Schema.Types.Mixed,

    //taxonomies
    _tags: [TagSchema],
    _category: {
        type: String,
        ref: 'System',
    },
    _type: {
        type: String,
        ref: 'Section'
    }
});
mongoose.model('Article', ArticleSchema, 'articles');
ArticleSchema.index({ '$**': 'text' });