const Pessoa                = require('../models/pessoa');
const Projeto               = require('../models/projeto');
const RelacionamentoProjeto = require('../models/relacionamentoProjetos');
const moment                = require('moment');
const mongoose              = require('mongoose');

var pessoaSessao;

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
                    pessoaSessao                = pessoas;
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
            console.log("ID: " + id);
            if(pessoas)
                return res.status(200).json({ "data": { "codigo": 200, pessoas } });
            else
                var mensagem = "Pessoa " + req.body.login + " não encontrada!";
                console.log(mensagem);
                return res.status(404).json({"data": {"codigo": 404, "mensagem": mensagem }});
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
            await pessoas.save().then((pessoas) => {
                console.log(login + " foi criado com sucesso");
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
        else if (req.session.tipo == 0) {// 1 - Responsável
            var {nome, descricao, data_inicio, data_fim} = req.body;
            var id_pessoa_cadastro = pessoaSessao._id;
            const projetos = new Projeto({nome, descricao, data_inicio, data_fim, id_pessoa_cadastro});
            console.log(projetos)

            await projetos.save().then((projetos) => {
                return res.status(201).json({"data": {"codigo": 201, projetos }});
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
        else if (req.session.tipo == 0) {// 1 - Responsável
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
        else if (req.session.tipo == 0) {// 1 - Responsável
            await Projeto.findOneAndRemove({ _id: { $in: req.params.id } }).then((projetos) => {
                return res.status(200).json({ "data": { "codigo": 200, projetos } });
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async getProjetoPorIDPessoaCadastro(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 1) {// 1 - Responsável
            const id = req.params.id;
            await Projeto.findOne({ id_pessoa_cadastro: id }).then((projetos) => {
                return res.status(200).json({ "data": { "codigo": 200, projetos } });
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async postSelecionarCandidato(req, res){
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// 1 - Responsável
            var {id_projeto, id_candidato} = req.body;

            var projeto   = await Projeto.findOne({ _id: id_projeto});
            var candidato = await Pessoa.findOne({ _id: id_candidato});

            if(projeto == null){
                return res.status(404).json({"data": {"codigo": 404, "mensagem": "O projeto informado não foi encontrado" }});
            }

            if(candidato == null){
                return res.status(404).json({"data": {"codigo": 404, "mensagem": "O candidato informado não foi encontrado" }});
            }

            var relacionado = await RelacionamentoProjeto.findOne({ id_projeto: projeto._id, id_candidato: candidato._id});
            if(relacionado != null){
                var selecionado = true;
                await RelacionamentoProjeto.findOneAndUpdate({_id: relacionado._id}, {selecionado}).then((relacionamentoProjetos) => {
                    console.log(relacionamentoProjetos);
                    return res.status(201).json({"data": 
                                                    {"codigo"      : 201, 
                                                     "selecionado" : "sim",
                                                     "projeto"     : projeto,
                                                     "candidato"   : candidato}});
                });
            }
            else{
                return res.status(401).json({"data": {"codigo": 401, "mensagem": "o candidato " + candidato.nome + " não se candidatou nesse projeto" }});
            }
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async postCandidatar(req, res){
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// 2 - Candidato
            var {id_projeto, id_candidato} = req.body;

            var projeto   = await Projeto.findOne({ _id: id_projeto});
            var candidato = await Pessoa.findOne({ _id: id_candidato});
            if(projeto == null){
                return res.status(404).json({"data": {"codigo": 404, "mensagem": "O projeto informado não foi encontrado" }});
            }

            if(candidato == null){
                return res.status(404).json({"data": {"codigo": 404, "mensagem": "O candidato informado não foi encontrado" }});
            }

            var relacionado = await RelacionamentoProjeto.findOne({ id_projeto: projeto._id, id_candidato: candidato._id});
            if(relacionado != null){
                if (relacionado.selecionado)
                    return res.status(401).json({"data": {"codigo": 401, "mensagem": "você já foi selecionado para esse projeto" }})
                else
                    return res.status(401).json({"data": {"codigo": 401, "mensagem": "você já se candidatou para esse projeto" }});
            }

            var selecionado    = false;
            id_pessoa_cadastro = projeto.id_pessoa_cadastro;
            const relacionamentoProjetos = new RelacionamentoProjeto({id_projeto, id_pessoa_cadastro, id_candidato, selecionado});
            await relacionamentoProjetos.save().then((relacionamentoProjetos) => {
                console.log(relacionamentoProjetos);
                return res.status(201).json({"data": 
                                                {"codigo"      : 201, 
                                                 "selecionado" : "você se candidatou, mas ainda não foi selecionado",
                                                 "projeto"     : projeto,
                                                 "candidato"   : candidato}});
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async getPopularidadeProjeto(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// 1 - Responsável
            var listaProjetos = [];
            var projeto       = await Projeto.find();
            for (const projetoSelecionado of projeto) {
                var relacionado = await RelacionamentoProjeto.find({ id_projeto: projetoSelecionado._id});
                listaProjetos.push("popularidade : " + relacionado.length, projetoSelecionado);
            }

            return res.status(200).json({ "data": { "codigo": 200, listaProjetos } });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async getPopularidadeProjetoPorID(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// 2 - Candidato
            const { id }  = req.params;
            var projeto = await Projeto.findById(id);
            if(projeto == null){
                return res.status(404).json({"data": {"codigo": 404, "mensagem": "O projeto informado não foi encontrado" }});
            }

            await RelacionamentoProjeto.find({ id_projeto: projeto._id}).then((relacionado) => {
                return res.status(200).json({ "data": 
                                                {"codigo": 200, 
                                                 "popularidade" : relacionado.length,
                                                 projeto } 
                                            });
            });
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async getListaPessoaSelecionadaPorProjeto(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// 2 - Candidato
            const { id }  = req.params;
            var projeto = await Projeto.findById(id);
            if(projeto == null){
                return res.status(404).json({"data": {"codigo": 404, "mensagem": "O projeto informado não foi encontrado" }});
            }

            var relacionado = await RelacionamentoProjeto.find({ id_projeto: projeto._id, selecionado: true});
            if(relacionado.length > 0){
                var pessoaIds = [];
                for (const relacionadoEncontrado of relacionado) {
                    pessoaIds.push(new mongoose.Types.ObjectId(relacionadoEncontrado.id_candidato));
                }
                var candidato = await Pessoa.find({_id: {$in: pessoaIds}});
            
                return res.status(200).json({ "data": {"codigo": 200, candidato } });
            }
            else{
                return res.status(200).json({ "data": {"codigo": 200, "mensagem": "Nenhuma Pessoa Foi Selecionada Para esse Projeto" } });
            }
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    },
    async getListaPessoaInteressadaPorProjeto(req, res) {
        if (req.session.login == undefined) {
            return res.status(401).json({"data": {"codigo": 401, "mensagem": "efetue o login para acessar a funcionalidade" }});
        }
        else if (req.session.tipo == 0) {// 2 - Candidato
            const { id }  = req.params;
            var projeto = await Projeto.findById(id);
            if(projeto == null){
                return res.status(404).json({"data": {"codigo": 404, "mensagem": "O projeto informado não foi encontrado" }});
            }

            var relacionado = await RelacionamentoProjeto.find({ id_projeto: projeto._id, selecionado: false});
            if(relacionado.length > 0){
                var pessoaIds = [];
                for (const relacionadoEncontrado of relacionado) {
                    pessoaIds.push(new mongoose.Types.ObjectId(relacionadoEncontrado.id_candidato));
                }
                var candidatosInteressados = await Pessoa.find({_id: {$in: pessoaIds}});
            
                return res.status(200).json({ "data": {"codigo": 200, candidatosInteressados } });
            }
            else{
                return res.status(200).json({ "data": {"codigo": 200, "mensagem": "Nenhum Candidato disponível até o momento" } });
            }
        }
        else{
            return res.status(403).json({"data": {"codigo": 403, "mensagem": "Acesso não autorizado a essa a funcionalidade" }});
        }
    }
}
