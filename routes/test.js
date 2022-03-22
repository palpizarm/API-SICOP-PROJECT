const express = require('express');
const router = express.Router();
const client = require('../client');


router.get('/', async (req, res) => {
    try {
        const response = await client.query(`SELECT NOW();`);
        res.json(response)
       
    } catch(error) {
        res.json({message: error})
    }
})

module.exports = router;