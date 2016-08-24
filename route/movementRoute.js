/**
 * Created by v.leonetti on 12/07/2016.
 */
var express = require('express');
var movementService = require('../service/MovementService');

var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', new Date());
    console.log('Request: ', req.method, ' | Data: ', req.body);
    next();
});

router.get('/', function(req, res) {
    movementService.find(req.query, function(err, objResponse) {
        objResponse.esito === 'KO'
            ? res.status(500).send(objResponse)
            : res.status(200).send(objResponse);
    });
});

router.post('/query/', function(req, res) {
    movementService.find(req.body, function(err, objResponse) {
        objResponse.esito === 'KO'
            ? res.status(500).send(objResponse)
            : res.status(200).send(objResponse);
    });
});

router.post('/calcolaTotale/', function(req, res) {
    movementService.calcolaTotale(req.body, function(err, objResponse) {
        objResponse.esito === 'KO'
            ? res.status(500).send(objResponse)
            : res.status(200).send(objResponse);
    });
});

router.get('/calcolaSaldo/', function(req, res) {
    movementService.calcolaSaldo(req.body, function(err, objResponse) {
        objResponse.esito === 'KO'
            ? res.status(500).send(objResponse)
            : res.status(200).send(objResponse);
    });
});

router.post('/', function(req, res) {
    movementService.save(req.body, function(err, objResponse) {
        objResponse.esito === 'KO'
            ? res.status(500).send(objResponse)
            : res.status(200).send(objResponse);
    });
});

router.put('/', function(req, res) {
    movementService.update(req.body, function(err, objResponse) {
        objResponse.esito === 'KO'
            ? res.status(500).send(objResponse)
            : res.status(200).send(objResponse);
    });
});

router.delete('/', function(req, res) {
    movementService.delete(req.query, function(err, objResponse) {
        objResponse.esito === 'KO'
            ? res.status(500).send(objResponse)
            : res.status(200).send(objResponse);
    });
});

module.exports = router;