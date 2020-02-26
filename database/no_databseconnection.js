/*
    @Author: José Ángel Molina
    @Date: January 2018
    @Company: 720tec SLL
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoClient = require('mongodb'),
    url = 'mongodb://127.0.0.1:27017/mydb';

mongoose.connect(url, { useMongoClient: true });

console.log(mongoose.connection.readyState);

module.exports = mongoose;
