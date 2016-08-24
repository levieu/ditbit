/**
 * Created by v.leonetti on 12/07/2016.
 */
var express = require("express"),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt

var secret = "stocazzodisecret";//new Date().getUTCMilliseconds().toString();

var app = express();

// We are going to protect /api routes with JWT
app.use('/ditbit/services', expressJwt({secret: secret}));
app.use('/ditbit/movement', expressJwt({secret: secret}));

//parser per le richieste in arrivo
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//cross-domain
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//imposto la porta del server
app.set('port', process.env.port || 3000);

/* Application REST routing */
app.use('/ditbit/login', require('./route/loginRoute'));
app.use('/ditbit/movement', require('./route/movementRoute'));
app.use('/ditbit/category', require('./route/categoryRoute'));


app.listen(app.get('port'), function () {
    console.log('Express ditbit server listening on port ' + app.get('port'));

    //open connection
    mongoose.connect('mongodb://127.0.0.1/ditbit'); //port 27017
    var db = mongoose.connection;
    db.on('error', function() {
        console.log("Error! Exiting... Must start MongoDB first");
        process.exit(1);
    });
    db.once('open', function() {
        // we're connected!
        console.log('Connection mongodb success');
    });
}).on('error', function(err) {
    console.log('Error start server on port ' + app.get('port') + ': ', err);
});
