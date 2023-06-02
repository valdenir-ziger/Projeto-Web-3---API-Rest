const db_mongoose = require('./config/db_mongoose');
const routes      = require('./routers/route');
const mongoose    = require('mongoose');
const express     = require('express');
const swaggerUI   = require('swagger-ui-express');
const path        = require('path');
const app         = express();
const unirest     = require("unirest");
var   cookieParser = require('cookie-parser');
var   session      = require('express-session');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); 
app.use(session({ secret:'valdenirziger',
                  resave: false,
                  saveUninitialized:true, 
                  cookie:{secure: false, maxAge: 3600000}}));
const swaggerDocument = require('./swagger.json');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs",swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(routes);

mongoose.set('strictQuery', true);
mongoose.connect(db_mongoose.connection, {useUnifiedTopology:true, useNewUrlParser:true}).then(()=>{
    console.log('Conectado em: mongodb+srv://valdenir:1234@clusterutfpr.2k7tc1v.mongodb.net/');
}).catch((error) =>{
    console.error('Erro ao conectar ao banco de dados:', error);
});

app.use(
    express.urlencoded({
        extended: true
    })
)

//###################### Bloco destinado ao teste ###################################
app.get('/testeLogin', async function (req, res) {
    var resposta = await unirest.post('http://localhost:8081/api/login') 
        //.headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'withCredentials': 'true', 'Access-Control-Allow-Origin': 'true', 'Access-Control-Allow-Credentials': 'true'})
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
//###################################################################################

app.listen(8081, function () {
    console.log("Servidor no http://localhost:8081")
});



