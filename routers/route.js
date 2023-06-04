const controllerAPI = require('../controllers/controllerAPI');
const express       = require('express');
const route         = express.Router();

module.exports = route;
//Login
route.post("/api/login", controllerAPI.postLogin);

//Pessoa
route.get("/api/buscapessoa/:id"     , controllerAPI.getPessoaById);
route.get("/api/pessoas"             , controllerAPI.getPessoa);
route.post("/api/cadastrarpessoa"    , controllerAPI.postPessoa);
route.put('/api/editarpessoa/:id'    , controllerAPI.putPessoa);
route.delete('/api/deletarpessoa/:id', controllerAPI.deletePessoa);
route.get("/api/candidatos"          , controllerAPI.getCandidatos);

//Projeto
route.get("/api/projetos"                  , controllerAPI.getPopularidadeProjeto);
route.post("/api/cadastrarprojeto"         , controllerAPI.postProjeto);
route.put('/api/editarprojeto/:id'         , controllerAPI.putProjeto);
route.delete('/api/deletarprojeto/:id'     , controllerAPI.deleteProjeto);
route.get("/api/buscarprojeto/:id"         , controllerAPI.getProjetoPorIDPessoaCadastro);
route.post("/api/selecionacandidato"       , controllerAPI.postSelecionarCandidato);
route.post("/api/candidatar"               , controllerAPI.postCandidatar);
route.get("/api/candidatosselecionados/:id", controllerAPI.getListaPessoaSelecionadaPorProjeto);
route.get("/api/candidatosinteressados/:id", controllerAPI.getListaPessoaInteressadaPorProjeto);
route.get("/api/projetopopularidade/:id"   , controllerAPI.getPopularidadeProjetoPorID);
    