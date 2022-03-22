const express = require("express");
const router = express.Router();
const client = require("../client");

router.get("/", async (req, res) => {
  try {
    const response = await client.query(`SELECT NOW();`);
    res.json({
      code: 6,
      msg: "",
      data: response,
    });
    res.status(200);
  } catch (error) {
    res.status(400);
    res.json({
      code: -6,
      msg: error,
      data: "",
    });
  }
});

module.exports = router;
