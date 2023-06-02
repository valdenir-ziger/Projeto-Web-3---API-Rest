const Pessoa  = require('../models/pessoa');
const Projeto = require('../models/projeto');
const moment  = require('moment');

module.exports = {
    //################ Login ##################################################
    async postLogin(req, res) {
        await Pessoa.findOne({login: req.body.login, 
                              senha: req.body.senha}).then((pessoas) => {
            if (pessoas != null) {
                if (pessoas.ocultado){
                    console.log("Usuário " + pessoas.login + " desativado!");
                    return res.status(401).json({"data": {"codigo": 401, pessoas }});
                }
                else{
                    req.session.login           = pessoas.login;
                    req.session.user            = pessoas.nome;
                    req.session.tipo            = pessoas.tipo;
                    req.session.tipo_descricao  = pessoas.tipo_descricao;
                    console.log("Usuário " + pessoas.login + " acabou de conectar como " + pessoas.tipo_descricao + "!"); 
                    
                    return res.status(200).json({"data": {"codigo": 200, pessoas }});
                }
            }
            else{
                var mensagem = "Usuário " + req.body.login + " não encontrado!";
                console.log(mensagem);
                return res.status(404).json({"data": {"codigo": 404, "mensagem": mensagem }});
                //return res.status(404).json();
            }
        });
    },

    //################ Pessoa ##################################################
    async getPessoa(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// administrador
            const pessoas = await Pessoa.find();
            return res.status(200).json({"data": {"codigo": 200, pessoas }});
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async getCandidatos(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// administrador
            const pessoas = await Pessoa.find({tipo : 2});
            return res.status(200).json({"data": {"codigo": 200, pessoas }});
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async getPessoaById(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "Efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// administrador
            const { id }  = req.params;
            const pessoas = await Pessoa.findById(id)
            console.log(id);
            if(pessoas)
                return res.status(200).json({ "data": { "codigo": 200, pessoas } });
            else
                var mensagem = "Pessoa " + req.body.login + " não encontrada!";
                console.log(mensagem);
                return res.status(404).json({"data": {"codigo": 404, "mensagem": mensagem }});
                //return res.status(404).json();
            }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async postPessoa(req, res){
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// administrador
            var {login, senha, nome, cpf, email, tipo} = req.body;
            var tipo_descricao = "Responsável"; 
            var ocultado       = false;

            if(tipo == 0 ){
                tipo_descricao = "Administrador";
            }
            else if(tipo == 1){
                tipo_descricao = "Candidato";
            }

            const pessoas = new Pessoa({login, senha, nome, cpf, email, tipo, tipo_descricao, ocultado});
            console.log(login + " foi criado com sucesso");

            await pessoas.save().then((pessoas) => {
                return res.status(201).json({"data": {"codigo": 201, pessoas }});
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async putPessoa(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// administrador
            await Pessoa.findOneAndUpdate({ _id: { $in: req.params.id } }, req.body).then((pessoas) => {
                return res.status(200).json({ "data": { "codigo": 200, pessoas } });
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async deletePessoa(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// administrador
            await Pessoa.findOneAndRemove({ _id: { $in: req.params.id } }).then((pessoas) => {
                return res.status(200).json({ "data": { "codigo": 200, pessoas } });
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },

    //################ Projeto ############################################################
    async getProjeto(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else{
            const projetos = await Projeto.find();
            return res.status(200).json({ "data": { "codigo": 200, projetos } });
        }
    },
    async postProjeto(req, res){
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 1) {// 1 - Responsável
            var {nome, descricao, data_inicio, data_fim} = req.body;
            var ocultado              = false;
            var data_inicio_formatado = moment(data_inicio).format('DD/MM/YYYY');
            var data_fim_formatado    = moment(data_fim).format('DD/MM/YYYY');

            const projetos = new Projeto({nome, descricao, data_inicio, data_inicio_formatado, data_fim, data_fim_formatado, ocultado});
            console.log(projetos)

            await projetos.save().then((projetos) => {
                return res.json({"data": {"codigo": 201, projetos }});
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async putProjeto(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 1) {// 1 - Responsável
            await Projeto.findOneAndUpdate({ _id: { $in: req.params.id } }, req.body).then((projetos) => {
                return res.status(200).json({ "data": { "codigo": 200, projetos } });
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async deleteProjeto(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 1) {// 1 - Responsável
            await Projeto.findOneAndRemove({ _id: { $in: req.params.id } }).then((projetos) => {
                return res.status(200).json({ "data": { "codigo": 200, projetos } });
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    }
}
