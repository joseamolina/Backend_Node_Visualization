/*
    @Author: José Ángel Molina
    @Date: January 2018
    @Company: 720tec SLL
 */
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'carretillasproyecto@gmail.com',
        pass: 'carretillas1995'
    }
});

module.exports = transporter;