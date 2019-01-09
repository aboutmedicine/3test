const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const history = require('connect-history-api-fallback');

const app = express();
const port = process.env.PORT || 9999;
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
	methods: ['GET','PUT', 'POST', 'DELETE'],
	allowedHeaders: ['X-Access-Token'],
	preflightContinue: true
};

//Middleware
app.use(history());
app.use(serveStatic(path.join(__dirname + '/dist')));
app.use(cors(corsOptions))
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