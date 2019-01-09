const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const mongoose = require('mongoose');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || 9999;


//Middleware
app.use(serveStatic(path.join(__dirname + '/dist')));
app.use(logger('dev'));


//models
require('./server/models');

//API routes
const posts = require('./server/routes/api/posts');
app.use('/api/posts/', posts);


//DB
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true
});

app.listen(port, () => {
	console.log('Listening on port ' + port);
	console.log(process.env.S3_BUCKET_NAME);
});