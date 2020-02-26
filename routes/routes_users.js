var express = require('express');
var router = express.Router();
var User = require('../database/users_databse_conn');
var keycload = require('../keys_cload');
var passwordgenerator = require('password-generator');

var transporter = require('../database/mailing');

var give_a_token = require('../ammended_functs/shared_functions');

/*
   Hace el login y lo gestiona
 */
router.post('/login', function (req, res) {

    console.log(req.body.username, req.body.password);

    console.log(__dirname);

    // Anidado de busquedas logicas.

    // Borrar todos los Usuarios clientes que sean de una fecha superior a 15 dias de forma automática
    const now_date = new Date();
    const date_year = new Date(now_date.getTime() - 86400000 * 15);
    User.remove({ fecha_ini: { $lte:  date_year.toISOString()}, rol: 'cliente' }, function(err) {

        if (err) {
            console.log("An error occurred!");
        } else {

            User.find({}, function (err, user_first) {
                if (err) console.log("An error occurred!");

                if (user_first.length === 0) {

                    var user_to_insert = new User({username: 'admin', password: 'admin', rol: 'admin'});

                    user_to_insert.save(function (err) {

                        if (err) {
                            console.log('An error ocurred while inserting default user!');
                        } else {
                            console.log('The admin user was firstly inserted!');
                            if (req.body.username === 'admin' && req.body.password === 'admin') {
                                res.status(200);
                                res.send({username: user_to_insert.username, keycload: keycload, rol: 'admin'});
                            } else {
                                console.log('No user was found!');
                                res.status(401);
                                res.json({cont: 'Bad credentials!'});
                                res.send();

                            }
                        }

                    });

                } else {
                        User.find({username: req.body.username, password: req.body.password}, function (err, user_founded) {
                            if (err) console.log("An error occurred!");

                            if (user_founded.length === 0) {
                                console.log('');
                                res.status(401);
                                res.json({cont: 'Bad_credentials!'});
                                res.send();

                            } else if (user_founded) {

                                console.log(user_founded);
                                res.status(200);
                                res.send({username: user_founded.username, rol: user_founded[0].rol, keycload: keycload });
                            }
                        });
                    }


            });
        }
    });
});

/*
    Registrar un usuario en el sistema
 */
router.post('/user', function (req, res) {


    const date_today = new Date;

    const _username = req.body.username;
    const _email = req.body.email;
    const _password = passwordgenerator(9, false);
    const _rol = req.body.rol;
    const _creation_date = date_today.toISOString();

    var user_to_insert = new User({username: _username, password: _password, rol: _rol, creation_date: _creation_date});

    var finalStatement;

    User.find({username: _username}, function (err, resp_us) {
       if (resp_us.length !== 0){

           res.status(401);
           res.send({contestacion: "US_ALREADY"});

       } else {

           user_to_insert.save(function (err) {
               if (err) {
                   res.status(401);
                   finalStatement = "USER_BEFORE";
               } else {

                   if (_rol === 'cliente') {

                       var mailOptions = {
                           from: 'carretillasproyecto@gmail.com',
                           to: _email,
                           subject: 'Credentials user to access the Proyecto Carretillas platform',
                           text: 'username: ' + _username + '\n password: ' + _password + '\n Go to you account and change your password if you want.'
                       };

                   } else {

                       var mailOptions = {
                           from: 'carretillasproyecto@gmail.com',
                           to: _username,
                           subject: 'Credentials user to access the Proyecto Carretillas platform',
                           text: 'username: ' + _username + '\n password: ' + _password + '\n Go to you account and change your password if you want. '
                       };

                   }

                   transporter.sendMail(mailOptions, function(error, info){
                       if (error) {
                           console.log(error);
                           res.status(401);
                           finalStatement = 'EMAIL_NO_VALID';
                       } else {

                           console.log('Email sent: ' + info.response);
                           res.status(200);
                           finalStatement = 'USER_INSERTED';
                       }
                   });


               }

           });

           res.send({contestacion: finalStatement});

       }
    });

});

router.get('/roleUser/:username', function (req, res) {

    const _username = req.params.username;

    User.find({username: _username}, function (err, user_found) {

        console.log(user_found.length);


        if (user_found.length === 0) {
            res.status(401);
            res.send('Not found');

        } else {
            res.status(200);
            res.send({rol: user_found[0].rol});
        }
    });

});

router.delete('/user/:username', function (req, res) {

    const _user = req.params.username;

    console.log(_user);
    User.remove({username: _user}, function (err, cont) {

        if (err) {
            res.status(404);
            res.send({contestacion: "Error"})
        } else {
            res.status(200);
            res.send({contestacion: "Exito"});
        }
    });
});

router.post('/changepwd', function (req, res) {

    const _username = req.body.username;
    const _old_pwd = req.body.old_pwd;
    const _new_pwd = req.body.new_pwd;

    const query = {username: _username, password: _old_pwd};

    console.log(query);

    User.find(JSON.stringify(query), function (err, user_founded) {

        console.log(user_founded);
        if (err) console.log("An error occurred!");

        if (user_founded.length === 0) {
            res.status(401);
            res.send({mensaje: "PASSWORD_INCORRECT"});

        } else if (user_founded) {
            User.findOneAndUpdate({username: _username}, {$set: {password: _new_pwd}}, function(err, doc){

                if (err) {
                    res.status(401);
                    res.send({mensaje: 'ERR_PASS'});

                } else {
                    res.status(200);
                    res.send({mensaje: 'PASS_CHANG'});

                }
            });


        }
    });
});

router.get('/user/:un', function (req, res) {
   User.find({username: req.params.un}, function (err, user_found) {

       if (err || user_found.length === 0 ) {
           res.status(401);
           res.send({cont: 'US_NOT_FND'});

       } else {
           res.status(200);
           res.send({cont: 'US_FND'});
       }
   });
});

router.get('/users', function (req, res) {

    User.find({rol : {$ne: 'admin'}}, function (err, users) {
        if (err) console.log("An error occurred!");

        if (users.length === 0) {
            res.status(401);
            res.send("No users found");

        } else {
            res.status(200);
            res.send(users);
        }
    });

});

module.exports = router;
