const { Client }  = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.URI,
    ssl: {
        rejectUnauthorized: false
    }
});


module.exports = client;