const express = require("express");
const router = express.Router();
const pool = require("../pool");

/*
Method: GET.
Description: Get all tenders that exists in LicitaTEC.
Request URL: http://localhost:3000/tenders/getAll
*/

router.get("/getAll", async (req, res) => {
  const client = await pool.connect()
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
  } finally {
    client.release()
  }
});

/*
Method: GET.
Description: Get all favorite tenders of the respective user.
Request URL: http://localhost:3000/tenders/getFavorites/:user_id
Request params: user_id
*/

router.get("/getFavorites/:user_id", async (req, res) => {
  const client = await pool.connect()
  try {
    //Get all favorite tenders of the respective user.
    const favoriteTenders = await client.query(
      `SELECT * FROM public."Tender" T INNER JOIN public."TenderSaved" F ON T.tender_id = F.tender_id WHERE user_id = ${req.params.user_id};`
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
  } finally {
    client.release()
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
  const client = await pool.connect()
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
  } finally {
    client.release()
  }
});

/*
Method: DELETE.
Description:Delete a specific favorite tender of the respective user.
Request URL: http://localhost:3000/tenders/deleteFavorite/:user_id/:tender_id
Request params: user_id,tender_id
*/
router.delete("/deleteFavorite/:user_id/:tender_id", async (req, res) => {
  const client = await pool.connect()
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
  } finally {
    client.release()
  }
});

/*
Method: POST.
Description: Insert tender in the history tender.
Request URL: http://localhost:3000/tenders/insertHistory
Request body: {"tender_id",
                "user_id" }
*/
router.post("/insertHistory", async (req, res) => {
  const client = await pool.connect()
  try {
    //Declaration of variables

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    // Insert tender to the TenderHistory table.
    const history = await client.query(
      `INSERT INTO public."TenderHistory"(tender_id, user_id, date)
      VALUES (${req.body.tender_id}, ${req.body.user_id}, '${today}');`
    );

    //Successful post
    res.status(200);
    res.json({
      code: 1,
      msg: "",
      data: history,
    });

  } catch (error) {
    res.status(400);
    res.json({
      code: -1,
      msg: error,
      data: "",
    });
  } finally {
    client.release()
  }
});

/*
Method: GET.
Description: Get the tender history of a respective user.
Request URL: http://localhost:3000/tenders/getHistory/:user_id
Request params: user_id
*/
router.get("/getHistory/:user_id", async (req, res) => {
  const client = await pool.connect()
  try {
    //Get all favorite tenders that exists in LicitaTEC.
    const historyUser = await client.query(
      `SELECT *  
      FROM public."Tender" t INNER JOIN public."TenderHistory" h
      on t.tender_id = h.tender_id
      WHERE h.user_id = ${req.params.user_id} and h.deleted = B'0'
      ORDER BY date ASC;`
    );

    //Successful get
    res.status(200);
    res.json({
      code: 1,
      msg: "",
      data: historyUser,
    });
  } catch (error) {
    res.status(400);
    res.json({
      code: -1,
      msg: error,
      data: "",
    });
  } finally {
    client.release()
  }
});

/*
Method: UPDATE.
Description: Delete tender history.
Request URL: http://localhost:3000/tenders/deleteHistory/
Request body: {"tender_ids":[]}
*/
router.patch("/deleteHistory", async (req, res) => {
  const client = await pool.connect()
  try {

    for (let i = 0; i < req.body.tender_ids.length; i++) {
      let deleteTender =
        await client.query(`UPDATE public."TenderHistory"
                            SET deleted = B'1' 
                            WHERE tender_history_id = ${req.body.tender_ids[i]};`);
    }

    //Successful delete
    res.status(200);
    res.json({
      msg: "",
      data: "",
      code: 1,
    });

  } catch (error) {
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1,
    });
  } finally {
    client.release()
  }
})

module.exports = router;
