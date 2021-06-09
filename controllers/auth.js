const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models").User;

const tokenAuth = (req, res, next) => {

        const token = req.headers["authorization"];

        if (!token)
                return res.status(400).send({ auth: false, message: "Bad Request" });

        jwt.verify(token, process.env.JWTENCRYPTION, (err, tokenBody) => {

                if (err)
                        return res.status(500).send({ auth: false, message: "Failed to authenticate token." });

                if (!tokenBody.id)
                        return res.status(503).send({ auth: false, message: "Bad Request" });

                User.findOne({ where: { id: tokenBody.id } }).then((user) => {

                        if (user) {
                                req.user = user;
                                next();
                        } else {
                                return res.status(403).send({ auth: false, message: "Bad Request" });
                        }
                }).catch((err) => {
                        return res.status(400).send({ auth: false, message: "Server Error" });
                });
        });
};

const getJWT = (data) => {
        return jwt.sign({ id: data }, process.env.JWTENCRYPTION);
};

module.exports = { getJWT, tokenAuth };