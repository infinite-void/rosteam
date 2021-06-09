const express = require("express");

const router = express.Router();

const auth = require("../controllers/auth");
const ros = require("../controllers/ros");

router.get("/question", auth.tokenAuth, ros.getQuestion);
router.post("/answer", auth.tokenAuth, ros.answer);
router.get("/leaderboard", auth.tokenAuth, ros.leaderboard);

module.exports = router;