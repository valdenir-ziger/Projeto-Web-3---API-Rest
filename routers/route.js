const controllerAPI = require('../controllers/controllerAPI');
const express       = require('express');
const route         = express.Router();

module.exports = route;
//Login
route.post("/api/login", controllerAPI.postLogin);

//Pessoa
route.get("/api/buscaPessoa/:id"     , controllerAPI.getPessoaById);
route.get("/api/pessoas"             , controllerAPI.getPessoa);
route.post("/api/cadastrarPessoa"    , controllerAPI.postPessoa);
route.put('/api/editarPessoa/:id'    , controllerAPI.putPessoa);
route.delete('/api/deletarPessoa/:id', controllerAPI.deletePessoa);
route.get("/api/candidatos"          , controllerAPI.getCandidatos);

//Projeto
route.get("/api/projetos"             , controllerAPI.getProjeto);
route.post("/api/cadastrarProjeto"    , controllerAPI.postProjeto);
route.put('/api/editarProjeto/:id'    , controllerAPI.putProjeto);
route.delete('/api/deletarProjeto/:id', controllerAPI.deleteProjeto);
    