const express = require("express");
const unirest = require("unirest");
const app     = express();

app.get('/testeLogin', async function (req, res) {
    var resposta = await unirest.post('http://localhost:8081/api/login') 
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send({ "login": "admin", "senha": "admin" });

    var  mensagem = "Codigo Retornado:" + resposta.status + " Mensagem: " + resposta.statusMessage;
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.get('/testeCadastrarPessoa', async function (req, res) {
    var resposta = await unirest.post('http://localhost:8081/api/cadastrarPessoa/')
        .send({ "login": "teste", 
                "senha": "teste", 
                "nome" : "teste",
                "cpf"  : "123456789",
                "email": "teste@teste",
                "tipo" : 2});

    var  mensagem = "Codigo Retornado:" + resposta.status + " Mensagem: " + resposta.statusMessage;
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.get('/testeEditarPessoa/:id', async function (req, res) {
    const { id } = req.params;
    var resposta = await unirest.put('http://localhost:8081/api/editarPessoa/'+id)
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.get('/testeDeletarPessoa/:id', async function (req, res) {
    const { id } = req.params;
    var resposta = await unirest.delete('http://localhost:8081/api/deletarPessoa/'+id)
    var  mensagem = "Codigo Retornado:" + resposta.status + " Mensagem: " + resposta.statusMessage;
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.get('/testeCandidatos', async function (req, res) {
    var resposta = await unirest.get('http://localhost:8081/api/candidatos')
    var  mensagem = "Codigo Retornado:" + resposta.status + " Mensagem: " + resposta.statusMessage;
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.get('/testeListarPessoas', async function (req, res) {
    var resposta = await unirest.get('http://localhost:8081/api/pessoas')
    var  mensagem = "Codigo Retornado:" + resposta.status + " Mensagem: " + resposta.statusMessage;
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.get('/testePessoaPorID/:id', async function (req, res) {
    const { id } = req.params;
    var resposta = await unirest.delete('http://localhost:8081/api/buscaPessoa/'+id)
    var  mensagem = "Codigo Retornado:" + resposta.status + " Mensagem: " + resposta.statusMessage;
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});

app.get('/testeCadastrarProjeto', async function (req, res) {
    var resposta = await unirest.post('http://localhost:8081/api/cadastrarProjeto/')
        .send({ "login": "teste", 
                "senha": "teste", 
                "nome" : "teste",
                "cpf"  : "123456789",
                "email": "teste@teste",
                "tipo" : 2});

    var  mensagem = "Codigo Retornado:" + resposta.status + " Mensagem: " + resposta.statusMessage;
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.get('/testeEditarProjeto/:id', async function (req, res) {
    const { id } = req.params;
    var resposta = await unirest.put('http://localhost:8081/api/editarProjeto/'+id)
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.get('/testeDeletarProjeto/:id', async function (req, res) {
    const { id } = req.params;
    var resposta = await unirest.delete('http://localhost:8081/api/deletarProjeto/'+id)
    var  mensagem = "Codigo Retornado:" + resposta.status + " Mensagem: " + resposta.statusMessage;
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.get('/testeListarProjetos', async function (req, res) {
    var resposta = await unirest.get('http://localhost:8081/api/projetos')
    var  mensagem = "Codigo Retornado:" + resposta.status + " Mensagem: " + resposta.statusMessage;
    if(resposta.body != undefined){
        mensagem = resposta.body;
    }

    console.log(mensagem);
    res.send(mensagem);
});
app.listen(3000, function () { 
    console.log("Servidor no http://localhost:3000")
});
