const express = require("express");

const router = express.Router();
const { 
  get, 
  create, 
  put, 
  remove 
} = require("./controller");

router.post("/role", create);
router.get("/role", get);
router.put("/role/:id", put);
router.delete("/role/:id", remove);

module.exports = router;
