require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());

// Habilitar el public

app.use( express.static( path.resolve(__dirname, '../public') ) );

//Configuracion global de rutas
app.use( require('./routes/index') );
 

mongoose.connect(process.env.URLDB, ( err, resp )=> {

    if  ( err ) throw err;

    console.log('Base de datos online');

});

app.listen(process.env.PORT, () =>{
    console.log('Escuchando puerto: ', process.env.PORT)
})