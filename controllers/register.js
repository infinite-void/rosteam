const User = require("../models").User
const {v4: uuidv4} = require("uuid");
const crypto = require("crypto")
const {getJWT} = require("./auth")
const {registrationMail} = require("../utils/mailer")
const jwt = require("jsonwebtoken");
const url = require("url");
const quickencrypt = require("quick-encrypt");
const fs = require("fs");
const { environment } = require("../config/environment");

const publicKey = fs.readFileSync(__dirname + process.env.PUBLICKEY, "utf-8");
const privateKey = fs.readFileSync(__dirname + process.env.PRIVATEKEY, "utf-8");

//new user registration
const register = async (req, res, next) => {
    const email = req.body.email;
    User.findOne({where: {email: email}}).then((user) => {
        // If user already exists
        if (user) {
            return res.status(403).send({message: "User already registered with this email"})
        } else {
            const vsalt = uuidv4();
            const salt = uuidv4();
            const pwdhash = crypto.createHash(process.env.HASHALGO, salt).update(req.body.pwd).digest("hex");

            User.create({
                id: uuidv4(),
                email: email,
                name: req.body.name,
                phone: req.body.phone,
                college: req.body.college,
                year: req.body.year,
                dept: req.body.dept,
                pwdhash: pwdhash,
                salt: salt,
                vsalt: vsalt,
                score: 0,
                lastanswer: null
            }).then((user) => {
                if (user) {                                        
                    const link = environment[process.env.NODE_ENV].url
                        + "api/user/verify" + url.format({
                            query: {
                                user: quickencrypt.encrypt(user.email, publicKey),
                                key: quickencrypt.encrypt(user.vsalt, publicKey)
                            }
                        });

                    registrationMail(user, link);
                    return res.status(200).send({
                        message: "Registration Successful. Account Verification Mail Sent.",
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        college: user.college,
                        year: user.year,
                        dept: user.dept
                    })
                } else {
                    return res.status(400).send({ message: "Server Error"})
                }
            }).catch((err) => {
                console.log(err);
                return res.status(500).send({ message: "Server Error"})
            })
        }
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({ message: "Server Error"})
    })
};

//mail verification function goes here.
const verify = (req, res, next) => {
    try {
        const email = quickencrypt.decrypt(req.query.user, privateKey);
        const key = quickencrypt.decrypt(req.query.key, privateKey);

        User.findOne({ where: { email: email } }).then((user) => {
            if (!user) {
                return res.status(400).send({
                    message: "Bad Link"
                })
            }

            // If already verified
            if (user.vsalt === null) {
                return res.status(400).send({
                    message: "Bad Link"
                })
            }

            // Set user id (email verified)
            if (user.vsalt === key) {
                user.update({
                    vsalt: null
                }).then((user) => {
                    return res.status(200).send({
                        message: "Email verified",
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        college: user.college,
                        year: user.year,
                        dept: user.dept,
                        token: getJWT(user.id)
                    })
                }).catch((err) => {
                    return res.status(500).send({ message: "Server Error" })
                })
            } else {
                return res.status(400).send({
                    message: "Bad Link"
                })
            }

        }).catch((err) => {
            return res.status(500).send({ message: "Server Error" })
        })
    } catch(err) {
        return res.status(500).send({ message: "Server Error" })
    }
};

module.exports = {register, verify};