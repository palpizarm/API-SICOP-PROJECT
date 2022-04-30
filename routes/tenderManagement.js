const express = require("express");
const router = express.Router();
const client = require("../client");

/*
Method: GET.
Description: Get all tenders that exists in LicitaTEC.
Request URL: http://localhost:3000/tenders/getAll
*/

router.get("/getAll", async (req, res) => {
  try {
    //Get all favorite tenders that exists in LicitaTEC.
    const allTenders = await client.query(
      `SELECT tender_id,name,description,name FROM public."Tender";`
    );

    //Successful get
    res.status(200);
    res.json({
      code: 6,
      msg: "",
      data: allTenders,
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

/*
Method: GET.
Description: Get all favorite tenders of the respective user.
Request URL: http://localhost:3000/tenders/getFavorites/:user_id
Request params: user_id
*/

router.get("/getFavorites/:user_id", async (req, res) => {
  try {
    //Get all favorite tenders of the respective user.
    const favoriteTenders = await client.query(
      `SELECT T.tender_id,name,description FROM public."Tender" T INNER JOIN public."TenderSaved" F ON T.tender_id = F.tender_id WHERE user_id = ${req.params.user_id};`
    );

    //Successful get
    res.status(200);
    res.json({
      code: 6,
      msg: "",
      data: favoriteTenders,
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

/*
Method: POST.
Description: Insert new favorite tender to the respective user.
Request URL: http://localhost:3000/tenders/createFavorite
Request body: {"user_id",
               "tender_id"}
*/

router.post("/createFavorite", async (req, res) => {
  try {
    // Insert new favorite tender to the respective user.
    const favorite = await client.query(
      `insert into public."TenderSaved" (user_id,tender_id)
            values ('${req.body.user_id}','${req.body.tender_id}');`
    );
    //Successful post
    res.status(200);
    res.json({
      code: 6,
      msg: "",
      data: favorite,
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

/*
Method: DELETE.
Description:Delete a specific favorite tender of the respective user.
Request URL: http://localhost:3000/tenders/deleteFavorite/:user_id/:tender_id
Request params: user_id,tender_id
*/
router.delete("/deleteFavorite/:user_id/:tender_id", async (req, res) => {
  try {
    //Delete a specific favorite tender of the respective user.
    const favorite = await client.query(
      `DELETE from public."TenderSaved" where user_id = '${req.params.user_id}' AND tender_id = '${req.params.tender_id}' ;`
    );

    //Successful delete
    res.status(200);
    res.json({
      code: 6,
      msg: "",
      data: favorite,
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
