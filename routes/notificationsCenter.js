const express = require('express');
const router = express.Router();
const pool = require('../pool');

/*
Method: GET.
Description: Get all the notifications of a respective user.
Request URL: http://localhost:3000/notificationsCenter/getNotifications
Request params: user_id
*/
router.get("/getNotifications/:user_id", async (req, res) => {
  const client = await pool.connect()
  try {
    let notifications = await client.query(
      `SELECT * FROM public."Notification"
            WHERE user_id = ${req.params.user_id};`
    );

    //Successful get
    res.status(200);
    res.json({
      msg: "",
      data: notifications,
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
  } finally {
    client.release()
  }
});



module.exports = router;