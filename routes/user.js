const express = require("express");

const router = express.Router();

const register = require("../controllers/register");
const login = require("../controllers/login");

router.post("/register", register.register);
router.verify("/verify", register.verify);

router.post("/signin", login.signin);

module.exports = { router };