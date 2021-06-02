const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ 
        extended: false 
}));
app.use(cors());

const userRoutes = require("./routes/user");

app.use("/api/user", userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
        console.log(`Listening on port ${port}`);
});