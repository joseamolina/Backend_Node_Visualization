/*
    @Author: Jose Angel Molina
    @Date: January 2018
    @Company: 720tec SLL
    Castellon de la Plana, Spain
 */
var express = require('express');
var router = express.Router();
var fileSystem = require('fs'),
    Videos = require('../database/videos_database_conn');

/*
    Accede al video y lo retransmite mediante streaming.
 */
router.get('/accessMedia/:video_ped/:video_date', function (req, res, next) {

    var _video_ped = req.params.video_ped.toUpperCase();
    var _video_date = req.params.video_date;

    console.log(req.headers.range);
    const date = new Date(_video_date);
    console.log(date);
    const mes = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const dia = (date.getDate()) < 10 ? '0' + date.getDate() : date.getDate();
    const dateString = date.getFullYear() + '_' + mes + '_' + dia;

    var path = './videos/' + dateString + '/' + _video_ped + '/' + dateString + '_' + _video_ped + '.mp4';

    var stat = fileSystem.statSync(path);

    fileSystem.stat(path, function (err, stats) {

        if (err) {
            if (err.code === 'ENOENT') {
                return res.sendStatus(404);
            }
            return next(err);
        }
        const range = req.headers.range;

        if (!range) {
            const err = new Error('Wrong range');
            err.status = 416;
            return next(err);
        }

        const positions = range.replace(/bytes=/, '').split('-');

        const start = parseInt(positions[0], 10);

        const file_size = stats.size;

        const end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;


        const chunksize = (end - start) + 1;

        const head = {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + file_size,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        };

        res.writeHead(206, head);

        const stream_position = {
            start: start,
            end: end
        };

        const stream = fileSystem.createReadStream(path, stream_position)

        stream.on('open', function () {

            stream.pipe(res);

        });

        stream.on('error', function (err) {

            return next(err);

        });

    });

});

/*
    Obtener inicialmente los 6 ultimos videos grabados en el sistema
    y mostrarlos por pantalla por defecto.
 */
router.get('/media', function (req, res) {

    // Regla de borrado automatico de videos.
    const now_date = new Date();
    const date_year = new Date(now_date.getTime() - 31556900000);

    Videos.remove({ fecha_ini: { $lte:  date_year.toISOString()} }, function(err) {
        if (!err) {

            console.log("Videos fueron borrados mayores de 1 año");

            var q = Videos.find({}).sort({
                'fecha': 1
            }).limit(6);

            q.exec(function (err, info) {
                if (err) {
                    console.log(err.message);
                    res.status(404);
                    res.send("Could not get media");
                } else {
                    res.status(200);
                    console.log(info);
                    res.json(info);
                }

            });
        }
        else {
            console.log("Hubo un error");
        }
    });

    //Proposito principal



});


router.get('/media/:user', function (req, res) {
    var _user = req.params.user;

    console.log(_user, '\n');

    Videos.find({cliente: _user}).exec(function (err, media_found) {
        if (err) {
            console.log(err.message);
            res.status(404);
            res.json({});
        } else {
            console.log(media_found);
            res.status(200);
            res.json(media_found);
        }
    });
});

/*
    Introduce nuevos videos en el sistema.
 */
router.post('/media', function (req, res) {

    var video_to_insert = new Videos(req.body);

    video_to_insert.save(function (err) {
        if (err) {
            console.log(err.message);
            res.status(404);
            res.send("Could not insert media")
        } else {
            res.status(200);
            res.send("Cool");
        }
    });
});

/*
    Borra el video dependiendo del id.
 */
router.delete('/media/:video_id', function (req, res) {

    var _video_id = req.params.video_id;

    Videos.remove({
        _id: _video_id
    }, function (err) {
        var contestacion = '';

        if (err) {
            contestacion = 'An error occurred while deleting!';
            res.status(400);
        } else {
            contestacion = 'Video deleted';
            res.status(200);
        }

        res.contentType('text/plain');
        res.send(contestacion);
    });

});

/*
    Obtiene los videos que se quiera dependiendo de los criterios de búsqueda que se le pasen.
 */
router.post('/consultMedia', function (req, res) {

    console.log(req.body);

    Videos.find(req.body).exec(function (err, mediaFound) {

        if (err) {
            console.log(err.message);
            res.status(404);
            res.json({});
        } else {
            console.log(mediaFound);
            res.status(200);
            res.json(mediaFound);
        }
    });

});

/*
    Responsible to get all initial petitions for inyecting data in searchers.
 */
router.get('/trt', function (req, res) {

    const jsonToSend = {};

    Videos.find().distinct('fecha', function (err, dates_found) {

        if (err) {
            console.log(err.message);
            res.status(404);
            res.send("Could not get media");

        } else {

            jsonToSend.dates_found = dates_found;

            Videos.find().distinct('carretilla', function (err, carretillas_found) {

                if (err) {
                    console.log(err.message);
                    res.status(404);
                    res.send("Could not get media");

                } else {

                    jsonToSend.carretillas_found = carretillas_found;

                    Videos.find().distinct('cliente', function (err, clientes_found) {

                        if (err) {
                            console.log(err.message);
                            res.status(404);
                            res.send("Could not get media");

                        } else {

                            jsonToSend.clientes = clientes_found;
                            res.status(200);
                            res.json(jsonToSend);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;