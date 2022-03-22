const express = require("express");
const router = express.Router();
const client = require("../client");

router.get("/", async (req, res) => {
  try {
    const response = await client.query(`SELECT NOW();`);
    res.status(201);
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
      data: "",
    });
  }
});

module.exports = router;
