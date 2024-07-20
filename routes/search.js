const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const admin = require("../middleware/admin");
const authorized = require("../middleware/authorize");


const util = require("util"); // helper 


//Show a history of monument searches related to his account only
router.get(
    "/history",authorized,
      async (req, res) => {
   
          // CHECK IF keyword  EXISTS in table job
          const x=res.locals.user.id;
          const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
          const searchhistory = await query(
            "select * from  search where user_id = ?", x);
  
            res.status(200).json(searchhistory);
        
      }
    );
    
  

//search with word    
router.get(
  "",authorized,
  body("keyword")
  .isString()
  .withMessage("please enter a valid keyword"),


  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
     

      // 2- CHECK IF monument EXISTS
      const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
      const checMonumentExists = await query(
          `select * from  monument where name= ? or name LIKE '%${req.body.keyword}%' `,
          [req.body.keyword],
        );
        
        if ( !checMonumentExists[0]) {
          return res.status(401).json({
            errors: [ 
              {
                msg: " no match !",
              },
            ],
          });
        }
        //save search keyword in db
        const saveKeyword = {
          user_id: res.locals.user.id,
          keyword:req.body.keyword ,
          
        };
        await query("insert into  search set ?  ", saveKeyword);
        
        //display searh result
      res.status(200).json(checMonumentExists);
    }  catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
);


  module.exports = router ;
  