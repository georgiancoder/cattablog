const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');

let mailController = {
  mailer: function(message,cb){
        nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        service:'Zoho',
        secureConnection: false,
        port: 587,
        auth: {
            user: 'giorgi@cattaclub.com',
            pass: 'rGJVA2Bu'
        },
        tls: {
          rejectUnauthorized: false
        }
    });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"girogi" <giorgi@cattaclub.com>', // sender address
            to: 'beqacalani@gmail.com', // list of receivers
            subject: message.email, // Subject line
            text: message.text, // plain text body
            html: message.html // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }else {
              cb(info);
            }
        });
    });
  }
}

module.exports = mailController;
