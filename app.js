var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan');
var logger = morgan();
var routes_files = require('./routes/routes_files'),
    routes_media = require('./routes/routes_media'),
    routes_users = require('./routes/routes_users');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

console.log("Process start");

app.use('/', express.static('public'));
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(logger);

app.use('/api',routes_files);
app.use('/api',routes_media);
app.use('/api',routes_users);

app.listen(process.env.PORT || 3000, function () {
    console.log('Node server running on localhost: 3000');
});