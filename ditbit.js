var http = require("http"),
    express = require("express"),
    path = require("path"),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./collectionDriver').CollectionDriver,
    bodyParser = require('body-parser');

var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,     Content-Type, Accept");
  next();
});

app.set('port', process.env.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



var mongoHost = 'localhost'; //A
var mongoPort = 27017; 
var collectionDriver;
 
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort)); //B
mongoClient.open(function(err, mongoClient) { //C
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  var db = mongoClient.db("learn");  //E
  collectionDriver = new CollectionDriver(db); //F
});

app.use(express.static(path.join(__dirname, 'public')));

/*
app.get('/', function (req, res) {
  res.send('<html><body><h1>Hello World</h1></body></html>');
});*/
/*app.get('/:a?/:b?/:c?', function (req,res) {
	res.send(req.params.a + ' ' + req.params.b + ' ' + req.params.c);
});*/
app.get('/:collection', function(req, res) { //A
 console.log("get "+ req.params.collection);
   var params = req.params; //B
   collectionDriver.findAll(req.params.collection, function(error, objs) { //C
    	  if (error) { 
		console.log("get error");
		res.send(400, error); 
	  } //D
	      else { 
		  console.log("get success");
	          //if (req.accepts('html')) { //E
    	          //res.render('data',{objects: objs, collection: req.params.collection}); //F
		  //res.status('200').json(JSON.stringify(objs))
              //} else {
	          res.setHeader('Content-Type','application/json'); //G
                  //res.send(200, JSON.stringify(objs)); //H
		  res.end(JSON.stringify(objs))
              //}
         }
   	});
});

app.post('/:collection', function(req, res) { //A
	//res.header("Access-Control-Allow-Origin", "http://localhost");
	//res.header("Access-Control-Allow-Methods", "GET, POST");
    console.log("save collection --> "+ req.params.collection);
	var objectBody = req.body;
	var object = JSON.parse(req.body.data);
	console.log("typeof req.body --> " + typeof req.body);
	console.log("typeof req.body.data --> " + typeof req.body.data);
	console.log("typeof JSON.parse(req.body.data) --> " + typeof object);
    console.log("body --> "+ JSON.stringify(objectBody));
    console.log("body.data --> "+ JSON.stringify(object) + " name: " + object.name + " vampires:" + object.vampires);
/*
var output = '';
for (var property in object) {
	console.log("proprietà --> " + property);
  output += property + ': ' + object[property]+'; ';
}
console.log(output);
*/

    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {
          if (err) { 
	  	console.log("save error");
		//res.send(400, err); 
		res.json(JSON.stringify(err));
	  } 
          else { 
		console.log("########### RESPONSE START ##############");
		console.log("typeof docs --> " + typeof docs);
	  	console.log("save success --> " + JSON.stringify(docs));
		console.log("Content-Type --> " + res.get('Content-Type'));
		//res.set('Content-Type', 'application/json');
		
		var objectResponse = new Object();
		objectResponse.messaggio = 'OK';
		objectResponse.info = docs;
		console.log("########### RESPONSE END ################");
		res.status(200).json(JSON.stringify(objectResponse));//'response='+JSON.stringify(docs)
		console.log("Content-Type --> " + res.get('Content-Type'));
	  } //B
     });
});
 
app.get('/:collection/:entity', function(req, res) { //I
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
   if (entity) {
       collectionDriver.get(collection, entity, function(error, objs) { //J
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //K
       });
   } else {
      res.send(400, {error: 'bad url', url: req.url});
   }
});

app.post('/init/login', function(req, res) { //A
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
	var objResponse = new Object();
	objResponse.authenticated = true;
	res.end(JSON.stringify(objResponse));
    	//res.send(200, "");
});
/*
app.use(function (req,res) {
    res.render('404', {url:req.url});
});
*/
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});	
