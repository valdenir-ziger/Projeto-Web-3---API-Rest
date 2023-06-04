const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const RelacionamentoProjeto = Schema({
    id_projeto: {
        type:Schema.Types.ObjectId, 
        default: new mongoose.mongo.ObjectId(),
        required:true
    },
    id_pessoa_cadastro: {
        type:Schema.Types.ObjectId, 
        default: new mongoose.mongo.ObjectId(),
        required:true
    },
    id_candidato: {
        type:Schema.Types.ObjectId, 
        default: new mongoose.mongo.ObjectId(),
        required:true
    },
    selecionado: { 
        type: Boolean,
        required:true,
        default: false
    }
});

module.exports = mongoose.model("RelacionamentoProjeto", RelacionamentoProjeto)