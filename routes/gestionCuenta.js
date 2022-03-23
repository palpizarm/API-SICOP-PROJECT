const express = require('express');
const router = express.Router();
const client = require('../client');


/*
Method: POST.
Description: Inactivate a cliente or maintenance user.
Request URL: http://localhost:3000/gestionCuenta/inactivateUser
Request body: {"user_id"}
*/
router.post('/inactivateUser', async (req, res) => {
    try {

        let updateUser = await client.query(`UPDATE public."User"
                                            SET actived = B'0' 
                                            WHERE user_id = ${req.body.user_id};`);
       
        //Successful inactivation
        res.status(200);
        res.json({
            msg: "",
            data: updateUser,
            code: 1
        })  

    } catch(error) {

        ////Registration failed
        res.status(400);
        res.json({
            msg: error,
            data: "",
            code: -1
        })
    }
})


module.exports = router;