/**
 * Created by v.leonetti on 12/01/2016.
 */
var Movement = require('./../mapper/Movement');

MovementService = function() {
};

MovementService.save = function(objData, callback) {
    var objResponse = {};
    var newMov = new Movement();
    newMov.descrizione = objData.descrizione;
    newMov.importo = objData.importo;
    newMov.tipoOperazione = newMov.importo > 0 ? 'I' : 'O'; //objData.tipoOperazione;
    newMov.dataOperazione = objData.dataOperazione;
    newMov.verificato = objData.verificato;
    newMov.categoria = objData.categoria;
    newMov.tipoCarta = objData.tipoCarta;
    newMov.save(function (err, newMov) {
        if (err){
            console.log("Save error! --> " + err);
            objResponse.esito = 'KO';
            objResponse.error = err;
            //callback(err, objResponse);
        }
        else{
            console.log("Save correct! --> " + newMov.descrizione + " - " + newMov._id);
            objResponse.esito = 'OK';
            objResponse.info = newMov;
            //callback(null, objResponse);
        }
        callback(err ? err : null, objResponse);
    });
};

MovementService.find = function(objData, callback) {
    var objResponse = {};
    Movement.find(valorizzaFiltri(objData), function (err, movs) {
        if (err){
            console.log("Find err! --> " + err);
            objResponse.esito = 'KO';
            objResponse.error = err;
            //callback(err, objResponse);
        }
        else{
            console.log("Find correct! --> " + movs);
            objResponse.esito = 'OK';
            objResponse.info = movs;
            //callback(null, objResponse);
            /*Movement.aggregate({ $match: filter}, {$group: {_id : null, totale : { $sum: "$importo" } } })
                .exec(function(err, result){
                    if(!err && result && result.length > 0){
                        objResponse.totale = result[0].totale;
                        console.log("Totale : " + objResponse.totale)
                    }
                    callback(null, objResponse);
            });*/
        }
        callback(err ? err : null, objResponse);
    });
};

MovementService.update = function(objData, callback) {
    var objResponse = {};
    var updMov = {};
    updMov.descrizione = objData.descrizione;
    updMov.importo = objData.importo;
    updMov.tipoOperazione = objData.tipoOperazione;
    updMov.dataOperazione = objData.dataOperazione;
    updMov.verificato = objData.verificato;
    updMov.categoria = objData.categoria;
    updMov.tipoCarta = objData.tipoCarta;
    console.log("Update id! --> " + objData._id);

    Movement.update({_id:objData._id}, updMov, function (err, updMov) {
        if (err){
            console.log("Update err! --> " + err);
            objResponse.esito = 'KO';
            objResponse.error = err;
            //callback(err, objResponse);
        }
        else{
            console.log("Update correct! --> " + updMov);
            console.log("Update id PRE! --> " + objData._id);
            console.log("Update id POST! --> " + updMov._id);
            objResponse.esito = 'OK';
            objResponse.info = updMov;
            //callback(null, objResponse);
        }
        callback(err ? err : null, objResponse);
    });
};

MovementService.delete = function (objData, callbackFunction){
    var objResponse = {};
    Movement.remove({_id:objData._id}, function (err, delBank) {
        if (err){
            console.log("Delete error! --> " + err);
            objResponse.esito = 'KO';
            objResponse.error = err;
            //callbackFunction(err, objResponse);
        }
        else{
            console.log("Delete correct! --> Number of item removed " +  delBank.result.ok);
            objResponse.esito = 'OK';
            objResponse.info = delBank;
            //callbackFunction(null, objResponse);
        }
        callbackFunction(err ? err : null, objResponse);
    });
};

MovementService.calcolaTotale = function(objData, callbackFunction){
    var objResponse = {};

    Movement.aggregate({ $match: valorizzaFiltri(objData)}, {$group: {_id : null, totale : { $sum: "$importo" } } })
    .exec(function(err, result){
        if(!err && result && result.length > 0){
            objResponse.totale = result[0].totale;
            console.log("Totale : " + objResponse.totale)
        }
        callbackFunction(err ? err : null, objResponse);
    });
};

MovementService.calcolaSaldo = function(objData, callbackFunction){
    var objResponse = {};

    Movement.aggregate({$group: {_id : null, totale : { $sum: "$importo" } } })
        .exec(function(err, result){
            if(!err && result && result.length > 0){
                objResponse.totale = result[0].totale;
                console.log("Saldo : " + objResponse.totale)
            }
            callbackFunction(err ? err : null, objResponse);
        });
};

/**
 * Valorizzo l'oggetto che contiene i filtri in base a quelli pervenuti in input al servizio
 *
 * @param objFilter
 */
function valorizzaFiltri(objFilter){
    var filter = {};
    if (objFilter){
        if (objFilter._id) {
            filter._id = objFilter._id;
        }
        if (objFilter.descrizione && objFilter.descrizione !== '') {
            filter.descrizione = {$regex: objFilter.descrizione, $options: 'i'};
        }
        if(objFilter.dataDal){
            filter.dataOperazione = {};
            filter.dataOperazione.$gte = new Date(objFilter.dataDal);
        }
        if(objFilter.dataAl){
            if (!filter.dataOperazione){
                filter.dataOperazione = {};
            }
            filter.dataOperazione.$lte = new Date(objFilter.dataAl);
        }
    }
    return filter;
}

//exports.MovementService = MovementService;
module.exports = MovementService;