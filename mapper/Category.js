/**
 * Created by v.leonetti on 03/06/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    codice: { type : String, required : true},
    nome: { type : String, required : true}
});

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;