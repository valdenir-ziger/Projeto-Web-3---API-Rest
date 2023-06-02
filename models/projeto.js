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
    data_inicio_formatado: { 
        type: String,
        required: true 
    },
	data_fim: { 
        type: Date,
        required: false 
    },
	data_fim_formatado: { 
        type: String,
        required: false 
    },
    ocultado: { 
        type: Boolean,
        required:true,
        default: false
    }
});

module.exports = mongoose.model("Projeto", Projeto)