const { Client }  = require('pg');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


//Middlewere
app.use(cors());

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json());



//import routes





// db connection

const client =  new Client({
    connectionString: process.env.URI,
    ssl: {
        rejectUnauthorized: false
    }
});


client.connect();


client.query(`SELECT * FROM public."User";`, (err,res)=> {
    if (err) throw err;
    console.log(JSON.stringify(res));

    client.end();
})


app.listen(3000);

module.exports = client;