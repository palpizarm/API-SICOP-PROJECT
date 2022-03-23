const express = require('express');
const router = express.Router();
const client = require('../client');


/*
Method: POST.
Description: Register a new client user.
Request URL: http://localhost:3000/registroUsuario/registerClient
Request body: {"name",
               "email",
               "password"}
*/
router.post('/registerClient', async (req, res) => {
    try {

        //Declaration of variables
        var format = new Boolean(false);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        //Validate correct mail format with regular expression
        emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (emailRegex.test(String(req.body.email))){
        
            format = true;

        }

        //Register new user
        if(format){
            
            let users = await client.query(`SELECT * FROM public."User"
                                        WHERE email = '${req.body.email}'`);
            
            //Validates if the user already exists
            if (users.rowCount == 0){

                //Register the new user with the query
                let register = await client.query(`INSERT INTO public."User"(name, email, role_id, 
                                                password, actived, deleted, date_created)
                                                VALUES ('${req.body.name}','${req.body.email}',
                                                ${3},crypt('${req.body.password}', gen_salt('bf')), B'1', B'0', '${today}')`);
                
                //Successful registration
                res.status(200);
                res.json({
                    msg: "",
                    data: register,
                    code: 1
                })

            }else{

                //Registration failed
                res.status(400);
                res.json({
                    msg: "El correo electrónico ya existe dentro del sistema.",
                    data: "",
                    code: -1
                })

            }                            
            
        }else{

            //Registration failed
            res.status(400);
            res.json({
                msg: "La dirección de email no cumple con el formato establecido.",
                data: "",
                code: -1
            })

        }
       
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


/*
Method: POST.
Description: Register the only Admin user.
Request URL: http://localhost:3000/registroUsuario/registerAdmin
Request body: {"name",
               "email",
               "password"}
*/
router.post('/registerAdmin', async (req, res) => {
    try {

        //Declaration of variables
        var format = new Boolean(false);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        //Validate correct mail format with regular expression
        emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (emailRegex.test(String(req.body.email))){
        
            format = true;

        }

        //Register new user
        if(format){
            
            let users = await client.query(`SELECT * FROM public."User"
                                        WHERE role_id = ${1}`);
            
            //Validates if the Admin already exists
            if (users.rowCount == 0){

                //Register the new Admin with the query
                let register = await client.query(`INSERT INTO public."User"(name, email, role_id, 
                                                password, actived, deleted, date_created)
                                                VALUES ('${req.body.name}','${req.body.email}',
                                                ${1},crypt('${req.body.password}', gen_salt('bf')), B'1', B'0', '${today}')`);
                
                //Successful registration
                res.status(200);
                res.json({
                    msg: "",
                    data: register,
                    code: 1
                })

            }else{

                //Registration failed
                res.status(400);
                res.json({
                    msg: "El Administrador ya existe dentro del Sistema.",
                    data: "",
                    code: -1
                })

            }                            
            
        }else{

            //Registration failed
            res.status(400);
            res.json({
                msg: "La dirección de email no cumple con el formato establecido.",
                data: "",
                code: -1
            })

        }
       
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


/*
Method: POST.
Description: Register a new maintenance user.
Request URL: http://localhost:3000/registroUsuario/registerMaintenance
Request body: {"name",
               "email",
               "password"}
*/
router.post('/registerMaintenance', async (req, res) => {
    try {

        //Declaration of variables
        var format = new Boolean(false);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        //Validate correct mail format with regular expression
        emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (emailRegex.test(String(req.body.email))){
        
            format = true;

        }

        //Register new user
        if(format){
            
            let users = await client.query(`SELECT * FROM public."User"
                                        WHERE email = '${req.body.email}'`);
            
            //Validates if the user already exists
            if (users.rowCount == 0){

                //Register the new user with the query
                let register = await client.query(`INSERT INTO public."User"(name, email, role_id, 
                                                password, actived, deleted, date_created)
                                                VALUES ('${req.body.name}','${req.body.email}',
                                                ${2},crypt('${req.body.password}', gen_salt('bf')), B'1', B'0', '${today}')`);
                
                //Successful registration
                res.status(200);
                res.json({
                    msg: "",
                    data: register,
                    code: 1
                })

            }else{

                //Registration failed
                res.status(400);
                res.json({
                    msg: "El correo electrónico ya existe dentro del sistema.",
                    data: "",
                    code: -1
                })

            }                            
            
        }else{

            //Registration failed
            res.status(400);
            res.json({
                msg: "La dirección de email no cumple con el formato establecido.",
                data: "",
                code: -1
            })

        }
       
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