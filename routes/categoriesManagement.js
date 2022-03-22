const express = require("express");
const router = express.Router();
const client = require("../client");

//Insert new category to Category table
router.post("/", async (req, res) => {
  try {
    let date = new Date();
    var month = date.getMonth() + 1;
    var formatDate = date.getFullYear() + "-" + month + "-" + date.getDate();

    const response = await client.query(
      `insert into public."Category" (category_id,name,user_id,date_created)
      values ( $1, $2, $3, $4);`,
      [req.body.category_id, req.body.name, req.body.user_id, formatDate]
    );
    res.status(200);
    res.json({
      code: 6,
      msg: "",
      data: response,
    });
  } catch (error) {
    res.status(400);
    res.json({
      code: -6,
      msg: error,
      data: formatDate,
    });
  }
});

module.exports = router;
