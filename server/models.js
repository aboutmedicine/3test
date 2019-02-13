const mongoose = require('mongoose');
const util = require('util');

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
        required: true
    }
}, {});
mongoose.model('Section', SectionSchema);



function AbstractArticleSchema() {
    //call super
    mongoose.Schema.apply(this, arguments);
    //add
    this.add({
        name: { type: String, required: true },
        description: { type: String, required: false },
        _tags: { type: Array, required: false },
        _category: {
            // type:  mongoose.Schema.Types.String,
            type: String,
            ref: 'System',
            required: false,
        },
    });
}

util.inherits(AbstractArticleSchema, mongoose.Schema);

const AnatomySchema = new AbstractArticleSchema();
mongoose.model('Anatomy', AnatomySchema, 'articles_anatomy');


const EthicsSchema = new AbstractArticleSchema();
mongoose.model('Ethics', EthicsSchema, 'articles_ethics');


const OSCECaseSchema = new AbstractArticleSchema();
OSCECaseSchema.add({
    structure: { type: String, required: false },
    mnemonic: { type: String, required: false },
    questions: { type: String, required: false }
});
mongoose.model('OSCE Cases', OSCECaseSchema, 'articles_osce');


const PathologySchema = new AbstractArticleSchema();
PathologySchema.add({
    hx: { type: String, required: false },
    ex: { type: String, required: false },
    ix: { type: String, required: false },
    mx: { type: String, required: false },
    notes: { type: String, required: false },
    etiology: { type: String, required: false, default: '' },
});
mongoose.model('Pathology', PathologySchema, 'articles_pathology');


const PhysiologySchema = new AbstractArticleSchema();
mongoose.model('Physiology', PhysiologySchema, 'articles_physiology');


const RadiologySchema = new AbstractArticleSchema();
mongoose.model('Radiology', RadiologySchema, 'articles_radiology');


const TestsSchema = new AbstractArticleSchema();
mongoose.model('Tests', RadiologySchema, 'articles_tests');