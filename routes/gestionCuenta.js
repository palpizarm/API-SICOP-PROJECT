const express = require("express");
const router = express.Router();
const client = require("../client");
const { patch } = require("./test");

/*
Method: PATCH.
Description: Inactivate a cliente or maintenance user.
Request URL: http://localhost:3000/gestionCuenta/inactivateUser
Request body: {"user_id"}
*/
router.patch("/inactivateUser", async (req, res) => {
  try {
    let updateUser = await client.query(`UPDATE public."User"
                                            SET actived = B'0' 
                                            WHERE user_id = ${req.body.user_id};`);

    //Successful inactivation
    res.status(200);
    res.json({
      msg: "",
      data: updateUser,
      code: 1,
    });
  } catch (error) {
    ////Inactivation failed
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1,
    });
  }
});

/*
Method: GET.
Description: Get all mantenance users that exists in LicitaTEC.
Request URL: http://localhost:3000/gestionCuenta/getMaintenanceUsers
*/
router.get("/getMaintenanceUsers", async (req, res) => {
  try {
    let maintenanceUsers = await client.query(
      `SELECT U.user_id,U.name,U.email,R.name as role FROM public."User" U,public."Role" R 
      WHERE U.role_id = R.role_id 
      AND R.role_id = 2;`
    );

    //Successful get
    res.status(200);
    res.json({
      msg: "",
      data: maintenanceUsers,
      code: 1,
    });
  } catch (error) {
    ////get failed
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1,
    });
  }
});

/*
Method: GET.
Description: Get all client users that exists in LicitaTEC.
Request URL: http://localhost:3000/gestionCuenta/getClientUsers
*/
router.get("/getClientUsers", async (req, res) => {
  try {
    let clientUsers = await client.query(
      `SELECT U.user_id,U.name,U.email,R.name as role FROM public."User" U,public."Role" R 
        WHERE U.role_id = R.role_id 
        AND R.role_id = 3;`
    );

    //Successful get
    res.status(200);
    res.json({
      msg: "",
      data: clientUsers,
      code: 1,
    });
  } catch (error) {
    ////get failed
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1,
    });
  }
});
/*
Method: GET.
Description: Get all users that exists in LicitaTEC.
Request URL: http://localhost:3000/gestionCuenta/getUsers
*/
router.get("/getUsers", async (req, res) => {
  try {
    let users = await client.query(
      `SELECT U.user_id,U.name,U.email,R.name as role FROM public."User" U,public."Role" R 
        WHERE U.role_id = R.role_id 
        AND R.name = 'Cliente' OR R.name='Mantenimiento';`
    );

    //Successful get
    res.status(200);
    res.json({
      msg: "",
      data: users,
      code: 1,
    });
  } catch (error) {
    ////get failed
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1,
    });
  }
});

/*
Method: POST.
Description: Login of the users.
Request URL: http://localhost:3000/gestionCuenta/login
Request body: {"email",
              "password"}
*/
router.post("/login", async (req, res) => {
  try {
    let confirmation = await client.query(
      `SELECT *
      FROM public."User"
      WHERE email = '${req.body.email}' 
      AND password = crypt('${req.body.password}', password);`
    );

    if (confirmation.rowCount == 0) {
      //Login failed
      res.status(200);
      res.json({
        msg: "El correo electrónico u contraseña no es correcta.",
        data: "",
        code: -1,
      });
    } else {
      //Successful login
      res.status(200);
      res.json({
        msg: "",
        data: confirmation,
        code: 1,
      });
    }
  } catch (error) {
    ////Login failed
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1,
    });
  }
});

module.exports = router;
