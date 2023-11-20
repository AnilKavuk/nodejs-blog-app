const express = require("express");
const router = express.Router();

const { getRegister, postRegister } = require("../controllers/auth-controller");

router.get("/register", getRegister);
router.post("/register", postRegister);

module.exports = router;
