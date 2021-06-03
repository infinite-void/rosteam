const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const getJWT = (data) => {
        return jwt.sign({ id: data }, process.env.JWTENCRYPTION);
};

module.exports = { getJWT };