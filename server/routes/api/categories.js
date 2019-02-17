const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const systems = mongoose.model('System');
const sections = mongoose.model('Section');

router.get('/', async (req, res) => {

    let promises = [
       systems.find({}).sort({ name: 1 }).exec(),
       sections.find({}).sort({ name: 1 }).exec(),
    ];

    Promise.all(promises).then(data => {
        res.send({
            systems: data[0],
            sections: data[1],
        });
    }).catch(e => {
        res.status(500).send(e);
    });

});



module.exports = router;