/*
    @Author: Jose Angel Molina
    @Date: January 2018
    @Company: 720tec SLL
    Castellon de la Plana, Spain
 */
var express = require('express');
var router = express.Router();
var fileSystem = require('fs');
var exec = require('child_process').exec;

/*
    Encargado de tomar una captura de foto del video deseado
 */
router.post('/takeScreenShot/:sec/', function (req, res) {

    console.log('screenshot');

    const fecha_vid = req.body.fecha,
        ped_vid = req.body.pedido;

    const _sec = req.params.sec;
    const _video_file = './videos/' + ped_vid + '/' + fecha_vid + '/' + ped_vid + '_' + fecha_vid + '.mp4';

    const output_file = './screenshots/screenshot_' + fecha_vid + '_' + ped_vid + '_' + _sec + '.jpg';

    try {
        const file = fileSystem.accessSync(output_file);
        res.status(200);
        res.send('getLinkScreenshot/screenshot_' + fecha_vid + '_' + ped_vid + '_' + _sec + '.jpg');

    } catch (e) {
            const child = exec('ffmpeg -ss ' + _sec + ' -i ' + _video_file + ' -vframes 1 -q:v 2 ' + output_file, function (err, stdout, stderr) {

                if (err) {
                    console.log('exec error: ' + err);
                    res.status(400);
                    res.send('Hubo un problema en con el screenshot');
                } else {
                    console.log('stdout: ' + stdout);
                    console.log('stderr ' + stderr);
                    console.log('Recorte con éxito');
                    res.status(200);
                    res.send('getLinkScreenshot/screenshot_' + fecha_vid + '_' + ped_vid + '_' + _sec + '.jpg');
                }
            });

    }
});

/*
     Encargado de proporcionar el screenshot mediante un link
 */
router.get('/getLinkScreenshot/:link', function (req, res) {

    console.log('acess_link');

    const ss_link = req.params.link;

    try {
        const file = fileSystem.accessSync('/Users/joseangelmolina/Desktop/BackEndJose/screenshots/' + ss_link);
        res.status(200);
        res.contentType('application/jpg');
        res.sendFile('./screenshots/' + ss_link, {
            root: __dirname + '/../'
        });

        } catch (e) {
            res.status(404);
            res.send('File does not exist');
        }

    });


/*
    Accede al link del video recortado para descargarlo
 */
router.get('/getLinkVideo/:link', function (req, res) {

    const video_link = req.params.link;
    console.log(video_link);

    try {

        res.status(200);
        res.contentType('application/mp4');
        res.sendFile('./videos_recorte/' + video_link, { root: __dirname + '/../' });

    } catch (e) {
        res.status(404);
        res.send('File does not exist');

    }

});


/*
    Se encarga de recortar el video dependiendo de un segundo inicial y otro final.
    No devuelve nada pero guarda el video en el sistema.
 */
router.post('/recorte', function (req, res) {

    const ins_ini = req.body.instante_inicial,
        ins_fin = req.body.instante_final,
        fecha_vid = req.body.fecha,
        ped_vid = req.body.pedido;

    const name_video = './videos/' + fecha_vid + '/' + ped_vid + '/' + fecha_vid + '_' + ped_vid + '.mp4';

    const name_video_recorte = './videos_recorte/my_frame_' + ped_vid + '_' + fecha_vid + '_' + ins_ini + '_' + ins_fin + '.mp4';

    console.log(name_video);

    const child = exec('ffmpeg -ss ' + ins_ini + ' -t ' + ins_fin + ' -i ' + name_video + ' -vcodec copy ' + name_video_recorte, function (err, stdout, stderr) {

        if (err) {
            console.log('exec error: ' + err);
            res.status(400);
            res.send('Hubo un problema en el recorte');
        } else {
            console.log('stdout: ' + stdout);
            console.log('stderr ' + stderr);
            console.log('Recorte con éxito');
            res.status(200);
            res.send('getLinkVideo/my_frame_' + ped_vid + '_' + fecha_vid + '_' + ins_ini + '_' + ins_fin + '.mp4');
        }
    });

});

module.exports = router;