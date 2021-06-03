const { v4: uuidv4 } = require("uuid");
const url = require("url");
const { getJWT } = require("./auth");

const User = require("../models").User;
const { environment } = require("../config/environment");

/* single function for both signin & signup with GoogleOAuth */
const googleSignin = (req, res, next) => {
        try {
                const email = req.user._json.email;
                
                User.findOne({ where: { email }}).then((user) => {
                        
                        if(user) {
                                return res.status(200).send({
                                        message: "User login successful.",
                                        email: user.email,
                                        name: req.user._json.name, 
                                        auth: true,
                                        score: user.score,
                                        lastanswer: user.lastanswer,
                                        token: getJWT(user.uid)
                                });             
                        } else {
                                User.create({
                                        id: uuidv4(),
                                        email,
                                        score: 0,
                                        lastanswer: null
                                }).then((user) => {
                                        if(user) {
                                                const token = getJWT(user.id);
                                                return res.status(200).send({
                                                        message: "User login successful.",
                                                        auth: true, 
                                                        email, 
                                                        name: req.user._json.name, 
                                                        score: 0,
                                                        lastanswer: null,
                                                        token: getJWT(user.id) 
                                                });
                                        } else {
                                                
                                                return res.status(400).send({ message: "Server Error"});
                                        }
                                }).catch((err) => {
                                        return res.status(400).send({ message: "Server Error"});
                                });  
                        }
                });
        } catch(err) {
                console.log(err);
                return res.status(500).send({ message: "Server Error." });
        }
};

module.exports = { googleSignin };