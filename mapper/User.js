/**
 * Created by v.leonetti on 25/01/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    nome: String,
    cognome: String,
    email: String,
    username: String,
    password: String
});

var User = mongoose.model('User', userSchema);

exports.User = User;
