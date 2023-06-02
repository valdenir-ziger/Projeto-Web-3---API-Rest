const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Pessoa = Schema({
    login: {
        type: String,
        required: true 
    },
    senha: { 
        type: String, 
        required: true 
    },
    nome: { 
        type: String,
        trim: true, 
        required: true 
    },
    cpf: { 
        type: String,
        trim: true, 
        required: true 
    },
    email: { 
        type: String,
        trim: true, 
        required: true 
    },
	tipo: { // 0 - Administrador, 1 - Responsável, 2 - Candidato
        type: Number,
        min: 0, 
        max: 2, 
        default: 2
    },
    tipo_descricao: { 
        type: String,
        trim: true, 
        default: "Responsável",
    },
    ocultado: { 
        type: Boolean,
        required:true,
        default: false
    }
});

module.exports = mongoose.model("Pessoa", Pessoa)