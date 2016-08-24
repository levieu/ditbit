/**
 * Created by v.leonetti on 12/07/2016.
 */
var express = require('express');
var categoryService = require('../service/CategoryService');

var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', new Date());
    console.log('Request: ', req.method, ' | Data: ', req.body);
    next();
});

router.get('/', function(req, res) {
    categoryService.find(req.body, function(err, objResponse) {
        objResponse.esito === 'KO'
            ? res.status(500).send(objResponse)
            : res.status(200).send(objResponse);
    });
});

module.exports = router;