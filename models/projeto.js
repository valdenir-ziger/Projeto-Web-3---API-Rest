const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Projeto = Schema({
    nome: {
        type: String, 
        required: true 
    },
    descricao: {
        type: String, 
        required: true 
    },
    data_inicio: { 
        type: Date,
        default: Date.now, 
        required: true 
    },
	data_fim: { 
        type: Date,
        required: false 
    },
    id_pessoa_cadastro: {
        type:Schema.Types.ObjectId
    }
});

module.exports = mongoose.model("Projeto", Projeto)