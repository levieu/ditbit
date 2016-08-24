var http = require("http"),
    express = require("express"),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    MovementService = require('./service/MovementService'),
    UserService = require('./service/UserService'),
    CategoryService = require('./service/CategoryService');

var jwt = require('jsonwebtoken');  //https://npmjs.org/package/node-jsonwebtoken
var expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt

var listServices = {};

var secret = "stocazzodisecret";//new Date().getUTCMilliseconds().toString();

var app = express();

// We are going to protect /api routes with JWT
app.use('/ditbit/services', expressJwt({secret: secret}));
app.use('/ditbit/movement', expressJwt({secret: secret}));

//parser per le richieste in arrivo
app.use(bodyParser.json() );       // to support JSON-encoded bodies
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

var movementService = new MovementService;
var userService = new UserService;

app.post('/ditbit/totali', function(req, res) {
    console.log("########### post ditbit/totali - START ###########");

    var objectRequest = JSON.parse(req.body.data);

    movementService.totale(objectRequest, function(error, objectResponse) {
        if (objectResponse.esito !== 'OK' || objectResponse.info.length == 0){
            res.status(401).send('Impossibile calcolare il totale!');
            return;
        }

        var user = {};
        user.nome = objectResponse.info.nome;
        user.cognome = objectResponse.info.cognome;
        user.email = objectResponse.info.email;
        user.email = objectResponse.info.username;

        // We are sending the profile inside the token
        var token = jwt.sign(user, secret, { expiresInMinutes: 60*1 });

        res.setHeader('Content-Type','application/json');
        var objResponse = {};
        objResponse.authenticated = true;
        objResponse.token = token;
        res.end(JSON.stringify(objResponse));

    });

    console.log("########### post ditbit/totali - END ###########");
});

app.post('/ditbit/services', function(req, res) {
    console.log("########### post movement - START ###########");

    console.log("----- REQUEST START -----");
    var objectRequest = JSON.parse(req.body.data);
    var nameService = objectRequest.service;
    var nameMethod = objectRequest.method;
    var data = objectRequest.data;
    console.log("request data --> "+ JSON.stringify(objectRequest));
    console.log("----- REQUEST END -----");

    var objectService = listServices[nameService];
    var objectServicePrototype = objectService['prototype'];
    console.log("----- RESPONSE START -----");
    objectServicePrototype[nameMethod](data, function(error, objectResponse) {
        var strResponse = JSON.stringify(objectResponse);
        console.log("esito --> " + strResponse);
        res.setHeader('Content-Type','application/json');
        if (objectResponse.esito == 'OK'){
            res.status(200).end(strResponse);
        }
        else{
            res.status(400).end(strResponse);
        }
        console.log("----- RESPONSE END -----");

        console.log("########### post movement - END ###########");
    });

});
/*
app.post('/ditbit/login', function(req, res) { //A
    console.log("########### LOGIN - START ###########");

	var objectRequest = JSON.parse(req.body.data);

	console.log("username:'" + objectRequest.username + "' - password:'" + objectRequest.password + "'");

    userService.find(objectRequest, function(error, objectResponse) {
        if (objectResponse.esito !== 'OK' || objectResponse.info.length == 0){
            res.status(401).send('Utente o password errati!');
            return;
        }

        var user = {};
        user.nome = objectResponse.info.nome;
        user.cognome = objectResponse.info.cognome;
        user.email = objectResponse.info.email;
        user.email = objectResponse.info.username;

        // We are sending the profile inside the token
        var token = jwt.sign(user, secret, { expiresInMinutes: 60*1 });

        res.setHeader('Content-Type','application/json');
        var objResponse = {};
        objResponse.authenticated = true;
        objResponse.token = token;
        res.end(JSON.stringify(objResponse));
    });
    console.log("########### LOGIN - END ###########");
});
*/
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));

    listServices['movement'] = MovementService;
    listServices['category'] = CategoryService;

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
});	
