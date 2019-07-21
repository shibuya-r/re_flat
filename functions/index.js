const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const gmailRecipient = functions.config().gmail.recipient;
admin.initializeApp();

// Gmail settings
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
});

// Request sending message by Gmail
exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        const msg = req.query.msg; // Add message-contents including URL query params.
        const mailOptions = {
            from: gmailEmail,
            to: gmailRecipient,
            subject: 'レッスンの予約を受け付けました。',
            html: `<p>${msg}</p>`
        };

        // Get respnse from Gmail
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended email successfully');
        });
    });
});

