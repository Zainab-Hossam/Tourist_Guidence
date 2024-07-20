const router = require("express").Router();
const { body,validationResult } = require("express-validator");
const conn = require("../db/dbConnection");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const util = require("util");
const { log, Console } = require("console");


router.post(
    "/register",
    body("email")
    .isEmail()
    .withMessage("please enter a valid email!"),

    body("user_name")
    .isString()
    .withMessage("please enter a valid user_name")
    .isLength({ min: 3, max: 20 })
    .withMessage("name should be between (3-20) character"),

    body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),
 
    body("age")  
    .isLength({min:1})
    .withMessage("please enter a valid age"),

    body("mobile_num")
    .isMobilePhone()
    .withMessage("please enter a valid mobile_num")
    .isLength({ min: 11 , max: 12 })
    .withMessage("mobile_num should be 11 number "),

    body("language")
    .isString()
    .withMessage("please enter a valid language")
    .isLength({ min: 5, max: 10 })
    .withMessage("language should be between (10-20) character"), 
    
    body("currency")
    .isString()
    .withMessage("please enter a valid currency")
    .isLength({ min: 5, max: 20 })
    .withMessage("currency should be between (10-20) character"), 
            
   
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
       
 
        // 2- CHECK IF EMAIL EXISTS
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const checkEmailExists = await query(
          "select * from  users where email = ?",
          [req.body.email]
        );
        if (checkEmailExists.length > 0) {
          res.status(400).json({
            errors: [ 
              {
                msg: "email already exists !",
              },
            ],
          });
        }
   
        // 3- PREPARE OBJECT USER TO -> SAVE
        const RegisterData = {
            id:req.body.id,
            email: req.body.email,  
            user_name: req.body.user_name,
            password: await bcrypt.hash(req.body.password, 10),
            age:req.body.age, 
            mobile_num: req.body.mobile_num,
            language :req.body.language,
            currency:req.body.currency,
            token: crypto.randomBytes(16).toString("hex"), 
        };
  
        // 4- INSERT USER OBJECT INTO DB
        await query("insert into users set ? ", RegisterData);
        delete RegisterData.password;
        res.status(200).json({msg:RegisterData});

      }  catch (error) {
        res.status(500).json({ err: error });
      }
    }
  );
  

  router.post(
    "/login",
    body("email").isEmail().withMessage("please enter a valid email!"),
    body("password")
      .isLength({ min: 8, max: 12 })
      .withMessage("password should be between (8-12) character"),
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF EMAIL EXISTS
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const user = await query("select * from users where email = ?", [
          req.body.email,
        ]);
        if (user.length == 0) {
          res.status(404).json({
            errors: [
              {
                msg: "email  not found !",
              },
            ],
          });
        }

        // 3- COMPARE HASHED PASSWORD
        const checkPassword = await bcrypt.compare( req.body.password, user[0].password );
        if (checkPassword) {
          delete user[0].password;
          res.status(200).json(user[0]);
        } else {
          res.status(404).json({
            errors: [
              {
                msg: " password not found !",
              },
            ],
          });
        }
        res.json("hi");
        
      } catch (error) {
        res.status(500).json({ err: error });
      }
    }
  );

 


module.exports = router;