const express = require("express");
const router = express.Router();

const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
} = require("../controllers/auth-controller");

router.get("/register", getRegister);
router.post("/register", postRegister);

router.get("/login", getLogin);
router.post("/login", postLogin);

router.get("/logout", getLogout);

module.exports = router;
