const mailer = require("nodemailer");
const dotenv = require("dotenv");
const {getJWT} = require("../controllers/auth")
dotenv.config();

const fs = require("fs");
const logfile = fs.createWriteStream(__dirname + "mailer.log", {flags: 'a'});

const transport = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.emailuser,
        pass: process.env.emailpass
    }
});

const registrationMail = (user, link) => {
    const message = {
        to: user.email,
        subject: "Registration Successful",
        html: `
                <p>Hello, ${user.name}.</p>
                <p>Thanks for registering to <b>Riddles of Sphinx</b> game.</p>
                <p>Click the below link to verify your email</p>            
                ` +
            "<a href=" + link + ">Click Here!</a>"

    }

    transport.sendMail(message, (err, info) => {
        const date = new Date();
        const time = date.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
        });

        if (err) {
            logfile.write(`\n[${time}] FAILURE: Registration Mail not sent to ${user.email}`);
        } else {
            logfile.write(`\n[${time}] SUCCESS: Registration Mail sent to ${user.email}`);
        }
    })

};

module.exports = {registrationMail};