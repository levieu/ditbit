/**
 * Created by v.leonetti on 12/01/2016.
 */
var Movement = require('./../mapper/Movement').Movement;

MovementService = function() {
};

MovementService.prototype.save = function(objData, callback) {
    var objResponse = {};
    var newMov = new Movement();
    newMov.descrizione = objData.descrizione;
    newMov.importo = objData.importo;
    newMov.tipoOperazione = objData.tipoOperazione;
    newMov.dataOperazione = objData.dataOperazione;
    newMov.save(function (err, newMov) {
        if (err){
            console.log("Save error! --> " + err);
            objResponse.esito = 'KO';
            objResponse.error = err;
            callback(err, objResponse);
        }
        else{
            console.log("Save correct! --> " + newMov.descrizione + " - " + newMov._id);
            objResponse.esito = 'OK';
            objResponse.info = newMov;
            callback(null, objResponse);
        }
    });
};

MovementService.prototype.find = function(objData, callback) {
    var objResponse = {};
    Movement.find(objData, function (err, movs) {
        if (err){
            console.log("Find err! --> " + err);
            objResponse.esito = 'KO';
            objResponse.error = err;
            callback(err, objResponse);
        }
        else{
            console.log("Find correct! --> " + movs);
            objResponse.esito = 'OK';
            objResponse.info = movs;
            callback(null, objResponse);
        }
    });
};

MovementService.prototype.update = function(objData, callback) {
    var objResponse = {};
    var updMov = {};
    updMov.descrizione = objData.descrizione;
    updMov.importo = objData.importo;
    updMov.tipoOperazione = objData.tipoOperazione;
    updMov.dataOperazione = objData.dataOperazione;
    console.log("Update id! --> " + objData._id);

    Movement.update({_id:objData._id}, updMov, function (err, updMov) {
        if (err){
            console.log("Update err! --> " + err);
            objResponse.esito = 'KO';
            objResponse.error = err;
            callback(err, objResponse);
        }
        else{
            console.log("Find correct! --> " + updMov);
            console.log("Update id PRE! --> " + objData._id);
            console.log("Update id POST! --> " + updMov._id);
            objResponse.esito = 'OK';
            objResponse.info = updMov;
            callback(null, objResponse);
        }
    });
};

exports.MovementService = MovementService;