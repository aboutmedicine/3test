const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Articles = mongoose.model('Article');

// const modelNames = mongoose.modelNames();

const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).send('You are not authenticated')
    } else {
        return next()
    }
};

router.get('/', async (req, res) => {

    try {
        res.send(await Articles.find({
            _category: req.query._category,
            _type: req.query._type
        }).exec());

    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }

});

router.post('/create', authMiddleware, async (req, res) => {
    console.log(req.body);
    try {

        let article = await Articles.findOne({
            _category: req.body._category,
            _type: req.body._type,
            name: req.body.name
        }).exec();

        console.log(article);

        if (article) {
            res.status(400).send({ message: 'Name already taken' })
        }
        else {
            Articles.create(req.body, (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).send(result);
            });

        }


    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});


router.post('/edit', authMiddleware, async (req, res) => {
    console.log(req.body);
    try {

        await Articles
            .findOneAndUpdate({
                _id: req.body._id
            }, req.body, (err) => {
                if (err) {
                    throw err;
                }
                else {
                    console.log('updated');
                    res.status(200).send('article updated');
                }
            })
            .exec();


    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});


router.post('/delete', authMiddleware, async (req, res) => {
    console.log(req.body);
    try {

        await Articles
            .findOneAndDelete({
                _id: req.body._id
            }, (err) => {
                if (err) {
                    throw err;
                }
                else {
                    console.log('deleted');
                    res.status(200).send('article deleted');
                }
            })
            .exec();


    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});


router.get('/search', async (req, res) => {
    const q = req.query.text;

    await Articles.createIndexes();

    try {

        const indices = Articles.schema.indexes();
       console.log(indices);

        // try to find exact phrase match first
        let matches = await Articles.find({
            $text: {
                $search: "\""+q+"\"",
            }
        }).exec();

        //otherwise try to find any word
        if(!matches.length) {
            matches = await Articles.find({
                $text: {
                    $search: q,
                }
            }).exec();
        }

        res.send(matches);

    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

module.exports = router;