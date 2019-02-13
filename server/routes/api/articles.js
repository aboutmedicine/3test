const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// const modelNames = mongoose.modelNames();

router.get('/', async (req, res) => {
    console.log(req.query);

    try {
        const model = mongoose.model(req.query.type);

        res.send(await model.find({ _category: req.query.category }).exec());

    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }

});

module.exports = router;