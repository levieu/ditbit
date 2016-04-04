var http = require("http"),
    express = require("express"),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    MovementService = require('./service/MovementService').MovementService;

var listServices = {};


var app = express();

//parser per le richieste in arrivo
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//cross-domain
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,     Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

//imposto la porta del server
app.set('port', process.env.port || 3000);

var movementService = new MovementService;

app.get('/ditbit/movement', function(req, res) {
    console.log("########### get movement - START ###########");

    console.log("----- REQUEST START -----");
    var objectRequest = {};
    //if (req.body.data != null)
        //objectRequest = JSON.parse(req.body.data);
    //objectRequest.tipoOperazione = 'O';
    console.log("request data --> "+ JSON.stringify(objectRequest));
    console.log("----- REQUEST END -----");

    console.log("----- RESPONSE START -----");
    movementService.find(objectRequest, function(error, objectResponse) {
        var strResponse = JSON.stringify(objectResponse);
        console.log("esito --> " + strResponse);
        res.setHeader('Content-Type','application/json');
        if (objectResponse.esito == 'OK'){
            res.status(200).end(strResponse);
        }
        else{
            res.status(400).end(strResponse);
        }
    });

    //res.setHeader('Content-Type','application/json'); //G
    //res.end(JSON.stringify(objs))
    console.log("----- RESPONSE END -----");
    console.log("########### get movement - END ###########");
});

app.post('/ditbit/movement', function(req, res) {
    console.log("########### post movement - START ###########");

    console.log("----- REQUEST START -----");
    var objectRequest = JSON.parse(req.body.data);
    console.log("request data --> "+ JSON.stringify(objectRequest));
    console.log("----- REQUEST END -----");

    console.log("----- RESPONSE START -----");
    movementService.save(objectRequest, function(error, objectResponse) {
        var strResponse = JSON.stringify(objectResponse);
        console.log("esito --> " + strResponse);
        res.setHeader('Content-Type','application/json');
        if (objectResponse.esito == 'OK'){
            res.status(200).end(strResponse);
        }
        else{
            res.status(400).end(strResponse);
        }
    });
    console.log("----- RESPONSE END -----");
    console.log("########### post movement - END ###########");
});

app.put('/ditbit/movement', function(req, res) {
    console.log("########### update movement - START ###########");

    console.log("----- REQUEST START -----");
    var objectRequest = JSON.parse(req.body.data);
    console.log("request data --> "+ JSON.stringify(objectRequest));
    console.log("----- REQUEST END -----");

    console.log("----- RESPONSE START -----");
    movementService.update(objectRequest, function(error, objectResponse) {
        var strResponse = JSON.stringify(objectResponse);
        console.log("esito --> " + strResponse);
        res.setHeader('Content-Type','application/json');
        if (objectResponse.esito == 'OK'){
            res.status(200).end(strResponse);
        }
        else{
            res.status(400).end(strResponse);
        }
    });
    console.log("----- RESPONSE END -----");
    console.log("########### update movement - END ###########");
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
    });
    console.log("----- RESPONSE END -----");

    console.log("########### post movement - END ###########");
});

app.post('/ditbit/login', function(req, res) { //A
    console.log("login --> ");
	//var objectBody = req.body;
	//var object = JSON.parse(req.body.data);
	console.log("typeof req.body --> " + typeof req.body);
	console.log("typeof req.body.data --> " + typeof req.body.data);
	console.log("typeof req.body.username --> " + typeof req.body.username);
	console.log("typeof req.body.password --> " + typeof req.body.password);
	var objectReq = JSON.parse(req.body.data);
	//var objectReq = req.body;
	console.log("username:'" + objectReq.username + "' - password:'" + objectReq.password + "'");
	res.setHeader('Content-Type','application/json'); //G
	var objResponse = {};
	objResponse.authenticated = true;
	res.end(JSON.stringify(objResponse));
    	//res.send(200, "");
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));

    listServices['movement'] = MovementService;

    //open connection
    mongoose.connect('mongodb://localhost/ditbit'); //port 27017
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
