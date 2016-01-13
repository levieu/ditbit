/**
 * Created by v.leonetti on 12/01/2016.
 */
/*function make(Schema, mongoose) {
    // Define Movement model
    var movementSchema = new Schema({
        descrizione: String,
        nomeBanca: String,
        importo: Number,
        tipoOperazione: String,
        tipoCarta: String,
        dataOperazione: Date,
        dataInserimento: { type: Date, default: Date.now }
    });
    mongoose.model('Movement', movementSchema);
}

exports.make = make;
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movementSchema = new Schema({
    descrizione: String,
    nomeBanca: { type : String, required : false},
    importo: Number,
    tipoOperazione: String,
    tipoCarta: String,
    dataOperazione: Date,
    dataInserimento: { type: Date, default: Date.now }
});

var Movement = mongoose.model('Movement', movementSchema);

exports.Movement = Movement;
