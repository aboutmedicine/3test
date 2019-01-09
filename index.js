const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 9999;


//Middleware
app.use(serveStatic(path.join(__dirname + '/dist')));
app.use(cors());
app.use(logger('dev'));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('/dist'));
	app.get('*', (request, response) => {
		response.sendFile(path.join(__dirname, '/dist', 'index.html'));
	});
}

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