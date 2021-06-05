//login function for existing user
const User = require("../models").User
const {getJWT} = require("./auth")
const crypto = require("crypto")

const signin = (req, res, next) => {
    const email = req.body.email;
    User.findOne({where: {email: email}}).then((user) => {
        // No user found
        if (!user) {
            return res.status(401).send({
                message: "User not registered"
            })
        }
        // User found
        else {
            // User email not verified
            if (user.id === null) {
                return res.status(400).send({
                    message: "User email not verified. Verification email already sent."
                })
            } else {
                const hash = crypto.createHash(process.env.HASHALGO, user.salt)
                    .update(req.body.pwd)
                    .digest("hex")

                // Password match
                if (hash === user.pwdhash) {
                    return res.status(200).send({
                        message: "Login Successful",
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        college: user.college,
                        year: user.year,
                        dept: user.dept,
                        token: getJWT(user.id)
                    })
                } else {
                    return res.status(401).send({
                        message: "Invalid Password"
                    })
                }
            }
        }

    }).catch((err) => {
        return res.status(500).send({message: "Server Error"})
    })
};

module.exports = {signin};