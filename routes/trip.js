const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const admin = require("../middleware/admin");

const util = require("util"); // helper 

// CREATE trip [ADMIN]
router.post(
    "", admin,

      body("destination")
      .isString()
      .withMessage("please enter a valid destination "),

    body("description")
      .isString()
      .withMessage("please enter a valid description ")
      .isLength({ min: 10 })
      .withMessage("description  should be at lease 20 characters"),

      body("price")
      .isNumeric()
      .withMessage("please enter a valid price"),

      body("num_of_reservation")
      .isNumeric()
      .withMessage("please enter a valid price"),


    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
  
        // 3- PREPARE TRIP object
        const tripObject = {
          
          destination :req.body.destination ,
          description: req.body.description,
          price:req.body.price,
          num_of_reservation:req.body.num_of_reservation

        };
  
        // 4 - INSERT tript INTO DB
        const query = util.promisify(conn.query).bind(conn);
        await query("insert into trip set ? ",  tripObject);
        res.status(200).json({
          msg: " trip created successfully !",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );
  
  //-------------------------------------------------------
  // UPDATE trip [ADMIN]
router.put(
    "/:id", // params
    admin,
    body("destination")
    .isString()
    .withMessage("please enter a valid destination "),

  body("description")
    .isString()
    .withMessage("please enter a valid description ")
    .isLength({ min: 10 })
    .withMessage("description  should be at lease 20 characters"),

    body("price")
    .isNumeric()
    .withMessage("please enter a valid price"),

    body("num_of_reservation")
    .isNumeric()
    .withMessage("please enter a valid price"),

    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF trip EXISTS OR NOT
        
        const trip = await query("select * from trip where id = ?", [
          req.params.id,
        ]);
        if (!trip[0]) {
          return res.status(404).json({ ms: "trip not found !" });
        }
  
        // 3- PREPARE tript OBJECT
        const tripObject = {
            
            destination :req.body.destination ,
            description: req.body.description,
            price:req.body.price,
            num_of_reservation:req.body.num_of_reservation
          };
    
        // 4- UPDATE trip
        await query("update trip set ? where id = ?", [tripObject, trip[0].id]);
  
        res.status(200).json({
          msg: "trip  updated successfully",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );
//-------------------------------------------------------
  // DELETE trip [ADMIN]
router.delete(
    "/:id", // params
    admin,
    async (req, res) => {
      try {
        // 1- CHECK IF trip EXISTS OR NOT
        const query = util.promisify(conn.query).bind(conn);
        const trip = await query("select * from trip where id = ?", [
          req.params.id,
        ]);
        if (!trip[0]) {
          res.status(404).json({ ms: "trip not found !" });
        }
        // 2- REMOVE trip 
        await query("delete from trip where id = ?", [trip[0].id]);
        res.status(200).json({
          msg: "trip delete successfully",
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
    const trip = await query(`select * from trip`);
    
    res.status(200).json(trip);
  });

  


module.exports = router ;