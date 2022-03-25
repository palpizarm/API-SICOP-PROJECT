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
    ////Registration failed
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
      `SELECT U.user_id,U.name,U.email FROM public."User" U,public."Role" R 
      WHERE U.role_id = R.role_id 
      AND R.name = 'Mantenimiento';`
    );

    //Successful inactivation
    res.status(200);
    res.json({
      msg: "",
      data: maintenanceUsers,
      code: 1,
    });
  } catch (error) {
    ////Registration failed
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
      `SELECT U.user_id,U.name,U.email FROM public."User" U,public."Role" R 
        WHERE U.role_id = R.role_id 
        AND R.name = 'Cliente';`
    );

    //Successful inactivation
    res.status(200);
    res.json({
      msg: "",
      data: clientUsers,
      code: 1,
    });
  } catch (error) {
    ////Registration failed
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1,
    });
  }
});

module.exports = router;
