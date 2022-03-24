const express = require("express");
const router = express.Router();
const client = require("../client");


router.get('/', async (req, res) => {
    try {
        const response = await client.query(`SELECT NOW();`);
        res.status(200);
        res.json({
            msg: "",
            data: response,
            code: 1
        })
       
    } catch(error) {
        res.status(400);
        res.json({
            msg: error,
            data: "",
            code: -1
        })
    }
})

module.exports = router;
