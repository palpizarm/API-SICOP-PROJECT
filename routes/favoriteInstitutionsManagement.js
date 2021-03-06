const express = require("express");
const router = express.Router();
const pool = require("../pool");

/*
Method: GET.
Description: Get all favorite institutions of the respective user.
Request URL: http://localhost:3000/institutions/getFavorites/:user_id
Request params: user_id
*/

router.get("/getFavorites/:user_id", async (req, res) => {
    const client = await pool.connect()
    try {
        //Get all favorite institutions of the respective user.
        const favoriteInstitutions = await client.query(
            `SELECT F.institution_id, I.name FROM public."FavoriteInstitution" F inner join public."Institution" I on I.institution_id = F.institution_id
                where F.user_id =  ${req.params.user_id};`
        );

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
    } finally {
        client.release()
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
    const client = await pool.connect()
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
    } finally {
        client.release()
    }
});

/*
Method: DELETE.
Description:Delete a specific favorite institution of the respective user.
Request URL: http://localhost:3000/institutions/deleteFavorite/:user_id/:institution_id
Request params: user_id,institution_id
*/
router.delete("/deleteFavorite/:user_id/:institution_id", async (req, res) => {
    const client = await pool.connect()
    try {
        //Delete a specific favorite institution of the respective user.
        const favorite = await client.query(
            `DELETE from public."FavoriteInstitution" where user_id = '${req.params.user_id}' AND institution_id = '${req.params.institution_id}' ;`
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
    } finally {
        client.release()
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
    const client = await pool.connect()
    try {
        //Edit a specific institution.
        const favorite = await client.query(
            `UPDATE public."Institution" 
        SET name ='${req.body.name}'
        WHERE institution_id = '${req.body.institution_id}' ;`
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
    } finally {
        client.release()
    }
});

/*
Method: GET.
Description: Get all  institutions register in the system.
Request URL: http://localhost:3000/institutions
Request params: user_id
*/

router.get("/", async (req, res) => {
    const client = await pool.connect()
    try {
        //Get all  institutions in the system.
        const institutions = await client.query(
            `SELECT * FROM public."Institution"`
        );

        //Successful get
        res.status(200);
        res.json({
            code: 6,
            msg: "",
            data: institutions,
        });
    } catch (error) {
        res.status(400);
        res.json({
            code: -6,
            msg: error,
            data: "",
        });
    } finally {
        client.release()
    }
});

module.exports = router;
