const express = require("express");
const router = express.Router();
const client = require("../client");


/*
Method: POST.
Description: Insert new category of words.
Request URL: http://localhost:3000/category/createCategory
Request body: {"name",
               "user_id",
               "words":[]}
*/
router.post("/createCategory", async (req, res) => {
  try {

    //Declaration of variables
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    //Register the new category with the query
    let registerCategory = await client.query(`INSERT INTO public."Category"(name, user_id, date_created)
                                        VALUES ('${req.body.name}',${req.body.user_id},'${today}');`);

    
    //Get the last registered category
    let lastCategory = await client.query(`SELECT category_id FROM public."Category" 
                                          ORDER BY category_id DESC LIMIT 1`);

    const idCategory = lastCategory.rows[0].category_id;

    //Register each word to the new category with the query                                      
    for(let i=0; i<req.body.words.length; i++){

      let registerWord = await client.query(`INSERT INTO public."Word"(word, category_id, date_created)
                                          VALUES ('${req.body.words[i]}',${idCategory},'${today}');`);


    }
    
    //Successful registration
    res.status(200);
    res.json({
        msg: "",
        data: lastCategory,
        code: 1
    })

  } catch (error) {
    
    res.status(400);
    res.json({
      msg: error,
      data: "",
      code: -1
    });

  }
});

module.exports = router;
