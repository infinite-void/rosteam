const express = require("express");
const passport = require("passport");

const router = express.Router();
require("../controllers/googleauth.js")(passport);

/* importing controller modules. */
const register = require("../controllers/register");
const login = require("../controllers/login");
const googlesignin = require("../controllers/googlesignin");

/* User end-points for login, signup, forgotPassword. */
router.post("/register", register.register);
router.post("/verify", register.verify);

router.post("/signin", login.signin);

router.get("/googlesignin",
        passport.authenticate("google", { 
                scope : ["profile", "email"] 
        })
);


/* user end-points for google OAuth. */
router.get("/google/callback",
        passport.authenticate("google", { 
                failureRedirect: "/api/user/googleautherror" 
        }),
        (err, req, res, next) => {
                if(err) {
                        console.log(err);
                        res.redirect("/api/user/googlesignin");
                }
                else
                        next();
        },
        googlesignin.googleSignin
);

router.get("/googleautherror", (req, res) => {
        return res.status(401).send({ message: "Google Authentication Error. Try Again." });
});

module.exports = router;