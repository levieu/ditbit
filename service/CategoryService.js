/**
 * Created by v.leonetti on 03/06/2016.
 */
var Category = require('./../mapper/Category');

CategoryService = function() {
};

CategoryService.find = function(objData, callback) {
    var objResponse = {};

    Category.find(objData, function (err, categories) {
        if (err){
            console.log("Find err! --> " + err);
            objResponse.esito = 'KO';
            objResponse.error = err;
            //callback(err, objResponse);
        }
        else{
            console.log("Find correct! --> " + categories);
            objResponse.esito = 'OK';
            objResponse.info = categories;
            //callback(null, objResponse);
        }
        callback(err ? err : null, objResponse);
    });
};

module.exports = CategoryService;