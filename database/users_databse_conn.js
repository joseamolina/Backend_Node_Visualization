/*
    @Author: José Ángel Molina
    @Date: January 2018
    @Company: 720tec SLL
 */
var mongoose = require('./no_databseconnection');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var userSchema = new Schema({
    username: String,
    password: String,
    rol: String,
    creation_date: Date
});

userSchema.plugin(autoIncrement.plugin, 'User');

var User = mongoose.model('User', userSchema);

module.exports = User;