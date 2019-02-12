const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Pathologies = mongoose.model('Pathology');
const Cases = mongoose.model('OSCECase');

router.get('/', async (req, res) => {

    res.send(await Pathologies.find().exec());

});

router.get('/pathologies', async (req, res) => {
    console.log(req.body);
    // res.send(await Pathologies.find({ _category: {$ne:'5c62af3a5dc65311810bff6e'} }).exec());
    res.send(await Pathologies.find({ name: 'Chlamydia' }).exec());
});


module.exports = router;