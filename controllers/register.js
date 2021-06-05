const User = require("../models").User
const {v4: uuidv4} = require("uuid");
const crypto = require("crypto")
const {getJWT} = require("./auth")
const {registrationMail} = require("../utils/mailer")
const jwt = require("jsonwebtoken");

//new user registration
const register = async (req, res, next) => {
    const email = req.body.email;
    User.findOne({where: {email: email}}).then((user) => {
        // If user already exists
        if (user) {
            return res.status(403).send({message: "User already registered with this email"})
        } else {

            if (req.body.pwd !== req.body.cpwd) {
                return res.status(400).send({message: "Password and Confirmation Password not matching"})
            }

            const salt = uuidv4();
            const pwdhash = crypto.createHash(process.env.HASHALGO, salt).update(req.body.pwd).digest("hex");

            User.create({
                id: null,
                email: email,
                name: req.body.name,
                phone: req.body.phone,
                college: req.body.college,
                year: req.body.year,
                dept: req.body.dept,
                pwdhash: pwdhash,
                salt: salt,
                vsalt: null,
                score: 0,
                lastanswer: null
            }).then((user) => {
                if (user) {
                    registrationMail(user)
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
                    return res.status(400).send({"message": "Server Error"})
                }
            }).catch((err) => {
                return res.status(500).send({"message": "Server Error"})
            })
        }
    }).catch((err) => {
        return res.status(500).send({"message": "Server Error"})
    })
};

//mail verification function goes here.
const verify = (req, res, next) => {
    const token = req.query.token;

    // If token arg is not present
    if (!token) {
        return res.status(400).send({
            message: "Email Verification Failed"
        })
    } else {
        jwt.verify(token, process.env.JWTENCRYPTION, (err, tokenBody) => {
            if (err || !tokenBody.id) {
                return res.status(500).send({
                    message: "Email Verification Failed"
                })
            }

            User.findOne({where: {email: tokenBody.id}}).then((user) => {
                if (!user) {
                    return res.status(400).send({
                        message: "Email Verification Failed"
                    })
                }

                // If already verified
                if (user.id !== null) {
                    return res.status(400).send({
                        message: "Email already verified"
                    })
                }

                // Set user id (email verified)
                user.update({
                    id: uuidv4()
                }).then((user) => {
                    return res.status(200).send({
                        message: "Email verified"
                    })
                }).catch((err) => {
                    return res.status(500).send({"message": "Server Error"})
                })

            }).catch((err) => {
                return res.status(500).send({"message": "Server Error"})
            })

        })

    }
};

module.exports = {register, verify};