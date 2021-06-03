const express = require("express");
const passport = require("passport");

const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

/* setting up the express config. */
app.use(express.json());
app.use(express.urlencoded({ 
        extended: false 
}));
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

/* importing required routing modules. */
const userRoutes = require("./routes/user");

/* setting the routes. */
app.use("/api/user", userRoutes);

const port = process.env.PORT || 3000;


/* starting server. */
app.listen(port, () => {
        console.log(`Listening on port ${port}`);
});