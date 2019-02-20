const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

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
        const model = mongoose.model(req.query.type);

        res.send(await model.find({ _category: req.query.category }).exec());

    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }

});

router.post('/create', authMiddleware, async(req, res) => {
    console.log(req.body);
    try {
        const model = mongoose.model(req.body.type);

        let article = await model.findOne({
            _category: req.body._category,
            name: req.body.name
        }).exec();
        
        console.log(article);

        if(article) {
            res.status(400).send({ message: 'Name already taken'})
        }
        else {
            model.create(req.body, (err, result) => {
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

router.post('/delete', authMiddleware, async(req, res) => {
    console.log(req.body);
    try {
        const model = mongoose.model(req.body.type);

        await model
            .findOneAndRemove({
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

router.post('/edit', authMiddleware, async(req, res) => {
    console.log(req.body);
    try {
        const model = mongoose.model(req.body.type);

        await model
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


module.exports = router;