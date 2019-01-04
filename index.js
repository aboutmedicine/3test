const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
// const logger = require('morgan');
// const bodyParser = require('body-parser');
// const cors = require('cors');

const app = express();
const port = process.env.PORT || 9999;

//Middleware
app.use(serveStatic(path.join(__dirname + '/dist')));
// app.use(cors());
// app.use(logger('dev'));
// app.use(bodyParser.json());


app.listen(port, () => {
	console.log('Listening on port ' + port);
});