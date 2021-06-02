const mailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const logfile = fs.createWriteStream(__dirname + "mailer.log", { flags: 'a' });

const transport = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
                user: process.env.emailuser,
                pass: process.env.emailpass
        }
});

const registrationMail = () => {

};

module.exports = { registrationMail };