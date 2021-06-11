const { questions } = require("../config/questions");

const User = require("../models").User;

const getQuestion = (req, res, next) => {
        try {
                if(req.user.score >= questions.length) {
                        return res.status(200).send({
                                gameOver:true,
                                message:"Game Over"                                
                        });
                }
                else {
                        return res.status(200).send({
                                gameOver:false,
                                question: questions[req.user.score].question,
                                clue1: questions[req.user.score].clue1,
                                clue2: questions[req.user.score].clue2
                        });
                }
        }
        catch(err) {
                return res.status(500).send({
                        message: "Server Error"
                });
        }

};

const answer = (req, res, next) => {
        try {
                if (req.body.answer === questions[req.user.score].answer) {
                        req.user.update({
                                score: req.user.score + 1,
                                lastanswer: Date.now()
                        }).then((user) => {
                                return res.status(200).send({
                                        message: "You got it!",
                                        score: user.score
                                });
                        }).catch((err) => {
                                console.log(err);
                                return res.status(500).send({
                                        message: "Server Error. Try Again"
                                });
                        });
                } else {
                        return res.status(400).send({
                                message: "Wrong Answer. Try Again.",
                                score: req.user.score
                        })
                }
        } catch(err) {
                return res.status(500).send({
                        message: "Server Error. Try Again"
                });
        }
};

const leaderboard = (req, res, next) => {
        try {
                User.findAll({
                        attributes: ['name', 'college', 'score', 'lastanswer'],
                        order: [
                                ['score', 'DESC'],
                                ['lastanswer', 'ASC']
                        ]
                }).then((users) => {
                        return res.status(200).send({
                                users
                        });
                }).catch((err) => {
                        return res.status(500).send({ message: "Server Error." });
                });
        } catch(err) {
                return res.status(500).send({
                        message: "Server Error."
                });
        };
};

module.exports = { getQuestion, answer, leaderboard };