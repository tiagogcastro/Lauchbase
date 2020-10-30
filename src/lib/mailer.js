const nodemailer = require('nodemailer')

module.exports =
    nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
        user: "07590c713abd7f",
        pass: "08f6355bbdac8c"
        }
    });