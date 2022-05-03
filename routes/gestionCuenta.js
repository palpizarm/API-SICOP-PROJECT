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
      `SELECT U.user_id,U.name,U.email,R.name as role, U.actived FROM public."User" U,public."Role" R 
      WHERE U.role_id = R.role_id 
      AND R.role_id = 2
	    AND U.deleted = B'0';`
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
      `SELECT U.user_id,U.name,U.email,R.name as role, U.actived FROM public."User" U,public."Role" R 
        WHERE U.role_id = R.role_id 
        AND R.role_id = 3
        AND U.deleted = B'0';`
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
      `SELECT U.user_id,U.name,U.email,R.name as role, U.actived FROM public."User" U 
      inner join public."Role" R 
      ON U.role_id = R.role_id 
      WHERE (R.role_id = 2 OR R.role_id=3) AND U.deleted = B'0';`
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
      AND password = crypt('${req.body.password}', password)
      AND deleted = B'0';`
    );

    if (confirmation.rowCount == 0) {
      //Login failed
      res.status(400);
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

/*
Method: DELETE.
Description: Delete a cliente or maintenance user.
Request URL: http://localhost:3000/gestionCuenta/deleteUser/:user_id
Request params: user_id
*/
router.delete("/deleteUser/:user_id", async (req, res) => {
  try {
    let deleteUser = await client.query(`UPDATE public."User"
                                        SET deleted = B'1' 
                                        WHERE user_id = ${req.params.user_id};`);

    //Successful deleted
    res.status(200);
    res.json({
      msg: "",
      data: deleteUser,
      code: 1,
    });
  } catch (error) {
    ////Deleted failed
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
Description: Get the user information by id
Request URL: http://localhost:3000/gestionCuenta/Account
Request body: {"user_id",
              "name",
              "email"}
*/
router.get("/getAccount/:user_id", async (req, res) => {
  try {
    let user = await client.query(`SELECT * FROM public."User"
                                  WHERE user_id = ${req.params.user_id}`)

    //Successful deleted
    res.status(200);
    res.json({
      msg: "",
      data: user,
      code: 1,
    });

  } catch (error) {
    ////get failed
    res.status(400);
    res.json({
      msg: error,
      data: "El usuario no existe",
      code: -1,
    });
  }

})

/*
Method: PATCH.
Description: Update the name and email of a user.
Request URL: http://localhost:3000/gestionCuenta/Account
Request body: {"user_id",
              "name",
              "email"}
*/
router.patch("/updateAccount", async (req, res) => {
  try {
    let updateAccount = await client.query(`UPDATE public."User"
                                        SET name = '${req.body.name}', 
                                        email = '${req.body.email}'
                                        WHERE user_id = ${req.body.user_id};`);

    //Successful update
    res.status(200);
    res.json({
      msg: "",
      data: updateAccount,
      code: 1,
    });
  } catch (error) {
    ////Update failed
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1,
    });
  }
});

/*
Method: PATCH.
Description: Update the password of a account.
Request URL: http://localhost:3000/gestionCuenta/updatePassword
Request body: {"user_id",
              "old_password",
              "new_password"}
*/
router.patch("/updatePassword", async (req, res) => {
  try {

    // check old password
    let confirmation = await client.query(
      `SELECT * FROM public."User"
      WHERE user_id = '${req.body.user_id}' 
      AND password = crypt('${req.body.old_password}', public."User".password)
      AND deleted = B'0';`
    );
    if (confirmation.rowCount == 0) {
      // old password incorrect
      res.status(200);
      res.json({
        msg: "Contraseña incorrecta",
        data: "",
        code: -4,
      });
    } else {
      // otherwise update the password normally
      let updatePassword = await client.query(`UPDATE public."User" 
                                          SET password = crypt('${req.body.new_password}',gen_salt('bf'))
                                          WHERE user_id = ${req.body.user_id}`);
      //Successful update
      res.status(200);
      res.json({
        msg: "Contraseña actualizada",
        data: updatePassword,
        code: 1,
      });
    }



  } catch (error) {
    ////Update failed
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1,
    });
  }
});

module.exports = router;
