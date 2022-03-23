const express = require("express");
const router = express.Router();
const client = require("../client");


//Get all favorite institutions that exists in the FavoriteInstitution table
router.get("/", async (req, res) => {
  try {

    const response = await client.query(
      `select * from public."FavoriteInstitution";`
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
      data: "",
    });
  }
});


//Insert new favorite institution to FavoriteInstitution table
router.post("/", async (req, res) => {
  try {

    const response = await client.query(
      `insert into public."FavoriteInstitution" (user_id,institution_id)
          values ($1,$2);`,
      [req.body.user_id, req.body.institution_id]
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
      data: "",
    });
  }
});


//delete by institution ID a specific favorite institution that exist in FavoriteInstitution table
router.delete("/", async (req, res) => {

  try {
    const response = await client.query(
      `delete from public."FavoriteInstitution" where institution_id = $1 ;`,
      [req.body.institution_id]
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
      data: "",
    });
  }
});


module.exports = router;
