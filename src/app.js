require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const router = require('../routes/routes')
const app = express();
const PORT = process.env.PORT;

//CONECTAR BASE DE DATOS
mongoose.connect(process.env.DB_URI, {
})
.then(() => console.log('Blu tu divais is succesfully conekted'))
.catch((error) => console.log('Error connecting to MongoDB:', error));

//midleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: 'mi palabra clave',
    saveUninitialized: true,
    resave: false
}))

app.use((req,res,next) =>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

app.use(express.static('upload'))

//Configurar motor de plantillas
app.set('view engine', 'ejs')

app.use('',router)

app.listen(PORT,()=> {
    console.log(`Servidor iniciado en http://localhost:${PORT}`)
})
