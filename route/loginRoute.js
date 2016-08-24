var express = require('express');
//var path = require('path');
var userService = require('../service/UserService');
var jwt = require('jsonwebtoken');  //https://npmjs.org/package/node-jsonwebtoken
//var expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt

var router = express.Router();

//var secret = new Date().getUTCMilliseconds().toString();
var secret = "stocazzodisecret";

router.use(function timeLog(req, res, next) {
    console.log('Time: ', new Date());
    console.log('Request: ', req.method, ' | Data: ', req.body);
    next();
});

router.post('/', function(req, res) {
    var objectRequest = req.body;
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
        //res.end(JSON.stringify(objResponse));
        res.status(200).send(objResponse);
    });

        /*userService.save(req.body, function(err, objResponse) {
        objResponse.esito === 'KO'
            ? res.status(500).send(objResponse)
            : res.status(200).send(objResponse);
    });*/
});

module.exports = router;