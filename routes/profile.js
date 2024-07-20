const router = require("express").Router();
const { body,validationResult } = require("express-validator");
const conn = require("../db/dbConnection");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const util = require("util");
const { log, Console } = require("console");
const authorized = require("../middleware/authorize");
const admin= require("../middleware/admin");
const session = require('express-session');


//update
router.put(
  "/:id", // params
  
  body("email").isEmail().withMessage("please enter a valid email!"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF job EXISTS OR NOT
      
      const userProfile= await query("select * from users where id = ?", [
        req.params.id,
      ]);
      if (!userProfile[0]) {
        return res.status(404).json({ ms: "userProfile not found !" });
      }     // 3- PREPARE product OBJECT
      const updateData = {
        email: req.body.email,  
        user_name: req.body.user_name,
        age:req.body.age, 
        mobile_num: req.body.mobile_num,
        role:req.body.role,
        language :req.body.language,
        currency:req.body.currency,
      
    };
      // 4- UPDATE 
      await query("update users set ? where id = ?", [updateData, userProfile[0].id]);

      res.status(200).json({
        msg: "userProfile updated successfully",updateData
      });
    } catch (err) {
      res.status(500).json(err);
    }}
)

router.delete(
    "/:id", // params
    admin,
    async (req, res) => {
      try {
        // 1- CHECK IF applicant EXISTS OR NOT
        const query = util.promisify(conn.query).bind(conn);
        const DeletedUser = await query("select * from users where id = ?", [
          req.params.id,
        ]);
        if (!DeletedUser[0]) {
          res.status(404).json({ ms: "User not found !" });
        }
        // 2- REMOVE applicant 
        await query("delete from users where id = ?", [DeletedUser[0].id]);
        res.status(200).json({
          msg: "user delete successfully",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );

  // LIST  [ADMIN]  
router.get("", admin , async (req, res) => {

    const query = util.promisify(conn.query).bind(conn);
    const usersProfile = await query(`select * from users`);
    
    res.status(200).json(usersProfile);
  });

  
//changePassword
  router.put(
    "/changePassword /id",
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const query = util.promisify(conn.query).bind(conn);
        const userID= await query("select * from users where id = ?", [
          req.params.id,
        ]);
        if (!userID[0]) {
          return res.status(404).json({
             ms: "userID not found !"
         });
        }
          const currentPassword=req.body.password;
                
          // 3- COMPARE HASHED PASSWORD
          const isPasswordValid = await bcrypt.compare(currentPassword, user[0].id);

          if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid current password' });
          }
        
         
          const newPassword={
            password: await bcrypt.hash(req.body.password, 10),
          }
          await query("update users set ? where id = ?", [hashedNewPassword, user[0].id]);

          res.status(200).json({ 
            message: 'Password changed successfully'
           });  
    }
    catch (err) {
      res.status(500).json(err);
    }}
)




module.exports = router;