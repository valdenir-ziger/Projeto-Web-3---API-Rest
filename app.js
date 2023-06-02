const db_mongoose  = require('./config/db_mongoose');
const routes       = require('./routers/route');
const mongoose     = require('mongoose');
const express      = require('express');
const swaggerUI    = require('swagger-ui-express');
const path         = require('path');
const app          = express();
var   cookieParser = require('cookie-parser');
var   session      = require('express-session');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); 
app.use(session({ secret:'valdenirziger',
                  name: 'APIRest',
                  resave: true,
                  saveUninitialized:true, 
                  cookie:{secure: false, maxAge: 30*60*1000}}));// 30 min
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

app.listen(8081, function () {
    console.log("Servidor no http://localhost:8081")
});



