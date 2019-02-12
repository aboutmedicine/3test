const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const history = require('connect-history-api-fallback');

const app = express();
const port = process.env.PORT || 9999;

//Middleware
app.use(history());
app.use(serveStatic(path.join(__dirname + '/dist')));
app.use(cors());
app.use(logger('dev'));

//models
require('./server/models');

//API routes
const posts = require('./server/routes/api/posts');
const categories = require('./server/routes/api/categories');
const articles = require('./server/routes/api/articles');

app.use('/api/posts/', posts);
app.use('/api/categories/', categories);
app.use('/api/articles/', articles);


//DB
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true
});

app.listen(port, () => {
	console.log('Listening on port ' + port);
	console.log(process.env.S3_BUCKET_NAME);
});
