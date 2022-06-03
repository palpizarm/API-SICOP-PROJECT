const express = require('express');
const router = express.Router();
const pool = require('../pool');
const transporter = require('../transporter');


/*
Method: POST.
Description: Register a new client user.
Request URL: http://localhost:3000/registroUsuario/registerClient
Request body: {"name",
               "email",
               "password"}
*/
router.post('/registerClient', async (req, res) => {
    const client = await pool.connect()
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

        if (emailRegex.test(String(req.body.email))) {

            format = true;

        }

        //Register new user
        if (format) {

            let users = await client.query(`SELECT * FROM public."User"
                                        WHERE email = '${req.body.email}'`);

            //Validates if the user already exists
            if (users.rowCount == 0) {

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

            } else {

                //Registration failed
                res.status(400);
                res.json({
                    msg: "El correo electrónico ya existe dentro del sistema.",
                    data: "",
                    code: -1
                })

            }

        } else {

            //Registration failed
            res.status(400);
            res.json({
                msg: "La dirección de email no cumple con el formato establecido.",
                data: "",
                code: -1
            })

        }

    } catch (error) {

        ////Registration failed
        res.status(400);
        res.json({
            msg: error,
            data: "",
            code: -1
        })
    } finally {
        client.release()
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
    const client = await pool.connect()
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

        if (emailRegex.test(String(req.body.email))) {

            format = true;

        }

        //Register new user
        if (format) {

            let users = await client.query(`SELECT * FROM public."User"
                                        WHERE role_id = ${1}`);

            //Validates if the Admin already exists
            if (users.rowCount == 0) {

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

            } else {

                //Registration failed
                res.status(400);
                res.json({
                    msg: "El Administrador ya existe dentro del Sistema.",
                    data: "",
                    code: -1
                })

            }

        } else {

            //Registration failed
            res.status(400);
            res.json({
                msg: "La dirección de email no cumple con el formato establecido.",
                data: "",
                code: -1
            })

        }

    } catch (error) {

        ////Registration failed
        res.status(400);
        res.json({
            msg: error,
            data: "",
            code: -1
        })
    } finally {
        client.release()
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
    const client = await pool.connect()
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

        if (emailRegex.test(String(req.body.email))) {

            format = true;

        }

        //Register new user
        if (format) {

            let users = await client.query(`SELECT * FROM public."User"
                                        WHERE email = '${req.body.email}'`);

            //Validates if the user already exists
            if (users.rowCount == 0) {

                //Register the new user with the query
                let register = await client.query(`INSERT INTO public."User"(name, email, role_id, 
                                                password, actived, deleted, date_created)
                                                VALUES ('${req.body.name}','${req.body.email}',
                                                ${2},crypt('${req.body.password}', gen_salt('bf')), B'1', B'0', '${today}')`);
                // send a email
                let mailOptions = {
                    from: 'licitatecmail@gmail.com',
                    to: 'pabloalpizar99@gmail.com',
                    subject: 'Registro exitoso Licitatec',
                    text: `Estimado  ${req.body.name},  le informamos que la creación de la cuenta en LICITATEC se realizo de manera exitosa. \nPuede visitar su perfil por medio del siguiente enlace: www.licitatec.cr/login.

                    Correo: ${req.body.email}
                    Contraseña: ${req.body.password}
                    Nota: Asegurese de cambiar su contraseña al ingresar por primera vez.
                    `
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                })

                // insert a notification for the user
                await client.query(`INSERT INTO public."Notification"(user_id, date_created, message, deleted, sent)
                                    SELECT user_id, '${today}', 
                                        'Bienvenido a LicitaTec. Su cuenta ha sido creada con éxito.',
                                        b'0',
                                        b'1'
                                    FROM public."User" 
                                    WHERE email = '${req.body.email}'`);

                // insert a notification for the admin (account created)
                await client.query(`INSERT INTO public."Notification"(user_id, date_created, message, deleted, sent)
                                    SELECT user_id, '${today}', 
                                        'La cuenta para ${req.body.name} ha sido creada con exito.',
                                        b'0',
                                        b'1'
                                    FROM public."User" 
                                    WHERE  role_id = 1`);

                //Successful registration
                res.status(200);
                res.json({
                    msg: "",
                    data: register,
                    code: 1
                })

            } else {

                //Registration failed
                res.status(400);
                res.json({
                    msg: "El correo electrónico ya existe dentro del sistema.",
                    data: "",
                    code: -1
                })

            }

        } else {

            //Registration failed
            res.status(400);
            res.json({
                msg: "La dirección de email no cumple con el formato establecido.",
                data: "",
                code: -1
            })

        }

    } catch (error) {

        ////Registration failed
        res.status(400);
        res.json({
            msg: error,
            data: "",
            code: -1
        })
    } finally {
        client.release()
    }
})

module.exports = router;