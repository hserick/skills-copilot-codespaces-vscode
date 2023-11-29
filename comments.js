// Create web server application
// 
// This is the main application for the comments API. It creates a web server
// and listens for incoming requests. When a request is received, it is routed
// to the appropriate controller.
// 
// The application is configured by a JSON file (config.json). This file is
// read and parsed when the application starts. It contains the following
// settings:
// 
// - host: The hostname to listen on. Defaults to localhost.
// - port: The port to listen on. Defaults to 3000.
// - log: The logging level. Defaults to "info". Can be set to "debug" or
//        "none".
// - db: The database settings. See config.json for details.
// 
// The application is started by running:
// 
//     node app.js
// 

// Load the required modules
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var winston = require('winston');
var mongoose = require('mongoose');

// Load the configuration file
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Configure logging
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: config.log
        })
    ]
});

// Connect to the database
mongoose.connect(config.db.url);

// Create the web application
var app = express();

// Configure the application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load the controllers
var commentController = require('./controllers/commentController.js');
var userController = require('./controllers/userController.js');

// Configure the routes
app.get('/comments', commentController.list);
app.post('/comments', commentController.create);
app.get('/comments/:id', commentController.read);
app.put('/comments/:id', commentController.update);
app.delete('/comments/:id', commentController.delete);

app.get('/users', userController.list);
app.post('/users', userController.create);
app.get('/users/:id', userController.read);
app.put('/users/:id', userController.update);
app.delete('/users/:id', userController.delete);

// Start the web server
app.listen(config.port, config.host, function() {
    logger.info('comments.js listening on ' + config.host + ':' + config.port);
});


