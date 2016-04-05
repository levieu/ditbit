/**
 * Created by v.leonetti on 25/01/2016.
 */
var User = require('./../mapper/User');

UserService = function() {
};

UserService.prototype.find = function(objData, callback) {
    var objResponse = {};
    User.find(objData, function (err, user) {
        if (err){
            console.log("Find err! --> " + err);
            objResponse.esito = 'KO';
            objResponse.error = err;
            callback(err, objResponse);
        }
        else{
            console.log("Find correct! --> " + user);
            objResponse.esito = 'OK';
            objResponse.info = user;
            callback(null, objResponse);
        }
    });
};

//exports.UserService = UserService;
module.exports = UserService;