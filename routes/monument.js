const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const admin = require("../middleware/admin");
const multer=require ("multer");

const util = require("util"); // helper 

// CREATE monument [ADMIN]
router.post(
    "", admin,
     body("name")
      .isString()
      .withMessage("please enter a valid monument name"),
  
    body("description")
      .isString()
      .withMessage("please enter a valid description ")
      .isLength({ min: 10 })
      .withMessage("description  should be at lease 20 characters"),

      body("location")
      .isString()
      .withMessage("please enter a valid location ")
      .isLength({ min: 5 })
      .withMessage("location  should be at lease 5 characters"),

      body("weather")
      .isString()
      .withMessage("please enter a valid weather "),

      body("historical_period")
      .isString()
      .withMessage("please enter a valid historical_period "),
      
      body("instructions")
      .isString()
      .withMessage("please enter a valid instructions "),

      body("availability")
      .isString()
      .withMessage("please enter a valid availability	 ")
      .isLength({ min: 2})
      .withMessage("availability  should be at lease 2 characters"),


    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
  
        // 3- PREPARE monument object
        const monumentObject = {
          name: req.body.name,
          description: req.body.description,
          location: req.body.location,
          weather :req.body.weather,
          historical_period :req.body.historical_period,
          instructions :req.body.instructions,
          availability :req.body.availability,
          

        };
  
        // 4 - INSERT monument INTO DB
        const query = util.promisify(conn.query).bind(conn);
        await query("insert into  monument set ? ",  monumentObject);
        res.status(200).json({
          msg: " monument created successfully !",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );
  
  //-------------------------------------------------------
  // UPDATE monument [ADMIN]
router.put(
    "/:id", // params
    admin,
    body("name")
      .isString()
      .withMessage("please enter a valid monument name"),
  
    body("description")
      .isString()
      .withMessage("please enter a valid description ")
      .isLength({ min: 10 })
      .withMessage("description  should be at lease 20 characters"),

      body("location")
      .isString()
      .withMessage("please enter a valid location ")
      .isLength({ min: 5 })
      .withMessage("location  should be at lease 5 characters"),

      body("weather")
      .isString()
      .withMessage("please enter a valid weather "),

      body("historical_period")
      .isString()
      .withMessage("please enter a valid historical_period "),
      
      body("instructions")
      .isString()
      .withMessage("please enter a valid instructions "),

      body("availability")
      .isString()
      .withMessage("please enter a valid availability	 ")
      .isLength({ min: 2})
      .withMessage("availability  should be at lease 2 characters"),

    

    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF monument EXISTS OR NOT
        
        const monument = await query("select * from monument where id = ?", [
          req.params.id,
        ]);
        if (!monument[0]) {
          return res.status(404).json({ ms: "monument not found !" });
        }
  
        // 3- PREPARE monument OBJECT
        const monumentObject = {
          name: req.body.name,
          description: req.body.description,
          location: req.body.location,
          weather :req.body.weather,
          historical_period :req.body.historical_period,
          instructions :req.body.instructions,
          availability :req.body.availability,
        

        };
        // 4- UPDATE monument
        await query("update monument set ? where id = ?", [monumentObject, monument[0].id]);
  
        res.status(200).json({
          msg: "monument  updated successfully",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );
//-------------------------------------------------------
  // DELETE monument [ADMIN]
router.delete(
    "/:id", // params
    admin,
    async (req, res) => {
      try {
        // 1- CHECK IF monument EXISTS OR NOT
        const query = util.promisify(conn.query).bind(conn);
        const monument = await query("select * from monument where id = ?", [
          req.params.id,
        ]);
        if (!monument[0]) {
          res.status(404).json({ ms: "monument not found !" });
        }
        // 2- REMOVE monument 
        await query("delete from monument where id = ?", [monument[0].id]);
        res.status(200).json({
          msg: "monument delete successfully",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );
//-------------------------------------------------------
  // LIST  [ADMIN, USER]
  
router.get("", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const monument = await query(`select * from monument`);
    
    res.status(200).json(monument);
  });

  


module.exports = router ;