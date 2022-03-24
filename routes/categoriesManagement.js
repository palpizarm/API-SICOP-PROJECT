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


/*
Method: GET.
Description: Get all categories of the respective user.
Request URL: http://localhost:3000/category/getCategories
Request body: {"user_id"}
*/
router.get("/getCategories", async (req, res) => {
  try {

    //Get all the categories of the respective user
    let categories = await client.query(`SELECT category_id, name, date_created 
                                        FROM public."Category"
                                        WHERE user_id = ${req.body.user_id} and deleted = B'0'`);

    //Successful get
    res.status(200);
    res.json({
        msg: "",
        data: categories,
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


/*
Method: GET.
Description: Get all the words of the respective category.
Request URL: http://localhost:3000/category/getWords
Request body: {"category_id"}
*/
router.get("/getWords", async (req, res) => {
  try {

    //Get all the words of the respective category
    let words = await client.query(`SELECT word_id, word, date_created 
                                        FROM public."Word"
                                        WHERE category_id = ${req.body.category_id} and deleted = B'0'`);

    //Successful get
    res.status(200);
    res.json({
        msg: "",
        data: words,
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

/*
Method: POST.
Description: Update a specific category of words.
Request URL: http://localhost:3000/category/updateCategory
Request body: {"category_id",
               "name",
               "user_id",
               "addWords":[],
               "deleteWords":[]}
*/
router.post("/updateCategory", async (req, res) => {
  try {

    //Declaration of variables
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    //Update name of exist category with the query
    let updateCategory = await client.query(`UPDATE public."Category" SET name = '${req.body.name}' 
                                              WHERE category_id = '${req.body.category_id}' ;`);

    
    //Register each word to the specific category with the query                                      
    for(let i=0; i<req.body.addWords.length; i++){

      let registerWord = await client.query(`INSERT INTO public."Word"(word, category_id, date_created)
                                          VALUES ('${req.body.addWords[i]}',${req.body.category_id},'${today}');`);
    }

    //Delete each word to the specific category with the query                                      
    for(let i=0; i<req.body.deleteWords.length; i++){

      let registerWord = await client.query(`UPDATE public."Word" SET deleted = B'1' 
                                          WHERE word = '${req.body.deleteWords[i]}' AND category_id = '${req.body.category_id}';`);
    }
    
    //Successful updated
    res.status(200);
    res.json({
        msg: "",
        data: updateCategory,
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
