/*
    @Author: José Ángel Molina
    @Date: January 2018
    @Company: 720tec SLL
 */
var mongoose = require('./no_databseconnection');
require('mongoose-double')(mongoose);
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var schemaTypes = Schema.Types;

autoIncrement.initialize(mongoose);

var videoSchema = new Schema({

    fecha_ini: Date,
    carretilla: String,
    cliente: String,
    pedido: String,
    hitos: [{
        nombre_linea_pedido: String,
        s_inicio: {type: schemaTypes.Double},
        s_final: {type: schemaTypes.Double},
        hitos_serie: [{
            nombre_numero_serie: String,
            s_inicio: {type: schemaTypes.Double},
            s_final: {type: schemaTypes.Double}
        }]
    }],
    duracion:  { type: schemaTypes.Double }
});

videoSchema.plugin(autoIncrement.plugin, 'Video');

var Video = mongoose.model('Video', videoSchema);

module.exports = Video;
