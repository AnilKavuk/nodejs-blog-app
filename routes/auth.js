const express = require("express");
const router = express.Router();

const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
} = require("../controllers/auth-controller");

router.get("/register", getRegister);
router.post("/register", postRegister);

router.get("/login", getLogin);
router.post("/login", postLogin);

module.exports = router;
