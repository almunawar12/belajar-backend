const express = require("express");
// const passport = require('passport');

const router = express.Router();
const { 
  get, 
  create, 
  put, 
  remove 
} = require("./controller");

router.post("/user", create);
router.get("/user", get);
router.put("/user/:id", put);
router.delete("/user/:id", remove);

module.exports = router;
