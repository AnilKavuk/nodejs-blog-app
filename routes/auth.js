const express = require("express");
const router = express.Router();

const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getReset,
  postReset,
} = require("../controllers/auth-controller");

const csrf = require("../middlewares/csrf-middleware");

router.get("/register", csrf, getRegister);
router.post("/register", postRegister);

router.get("/login", csrf, getLogin);
router.post("/login", postLogin);

router.get("/reset-password", csrf, getReset);
router.post("/reset-password", postReset);

router.get("/logout", csrf, getLogout);

module.exports = router;
