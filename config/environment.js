const dotenv = require("dotenv");
dotenv.config();

const environment = [
        {
                type: "development",
                url: process.env.devurl
        },
        {
                type: "production",
                url: process.env.produrl
        }
];

module.exports = { environment };