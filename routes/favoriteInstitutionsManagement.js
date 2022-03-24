const express = require("express");
const router = express.Router();
const client = require("../client");



/*
Method: GET.
Description: Get all favorite institutions of the respective user.
Request URL: http://localhost:3000/institutions/getFavorites/:user_id
Request params: user_id
*/

router.get("/getFavorites/:user_id", async (req, res) => {
  try {

    //Get all favorite institutions of the respective user.
    const favoriteInstitutions = await client.query(
      `SELECT legal_id,abbreviation,name FROM public."Institution" I,public."FavoriteInstitution" F where F.user_id = ${req.params.user_id};`);

    //Successful get
    res.status(200);
    res.json({
      code: 6,
      msg: "",
      data: favoriteInstitutions,
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
Description: Insert new favorite institution to the respective user.
Request URL: http://localhost:3000/institutions/createFavorite
Request body: {"user_id",
               "institution_id"}
*/

router.post("/createFavorite", async (req, res) => {
  try {
   // Insert new favorite institution to the respective user
    const favorite = await client.query(
      `insert into public."FavoriteInstitution" (user_id,institution_id)
          values ('${req.body.user_id}','${req.body.institution_id}');`
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
Description:Delete a specific favorite institution of the respective user.
Request URL: http://localhost:3000/institutions/deleteFavorite
Request body: {"user_id",
               "institution_id"}
*/
router.delete("/deleteFavorite", async (req, res) => {

  try {
    //Delete a specific favorite institution of the respective user.
    const favorite = await client.query(
      `delete from public."FavoriteInstitution" where user_id = '${req.body.user_id}' AND institution_id = '${req.body.institution_id}' ;`
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

/*
Method: POST.
Description:Edit a specific institution.
Request URL: http://localhost:3000/institutions/edit
Request body: {"institution_id",
               "legal_id",
               "abbreviation",
               "name"
                }
*/
router.post("/edit", async (req, res) => {

  try {
    //Edit a specific institution.
    const favorite = await client.query(
      `UPDATE public."Institution" 
          SET legal_id = '${req.body.legal_id}',name ='${req.body.name}',abbreviation = '${req.body.abbreviation}'
              WHERE institution_id = '${req.body.institution_id}' ;`);

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

module.exports = router;
