const { Client }  = require('pg');
const express = require('express');
const app = express();
const cors = require('cors');
const client = require('./client');


//Middlewere
app.use(cors());

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());



//import routes
const testRoute = require('./routes/test');
const registroUsuarioRoute = require('./routes/registroUsuario');
const gestionCuentaRoute = require('./routes/gestionCuenta');


app.use('/test', testRoute);
app.use('/registroUsuario', registroUsuarioRoute);
app.use('/gestionCuenta', gestionCuentaRoute);


client.connect( err => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('connected to postgresql database. Listen in port localhost:3000')
    }
});

// server listing in port 3000
app.listen(3000);