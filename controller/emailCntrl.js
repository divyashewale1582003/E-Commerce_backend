const nodemailer =  require('nodemailer')
const asyncHandler = require('express-async-handler')



/*const express = require("express");
const router = express.Router();
//const nodemailer = require("nodemailer");
const randomstring = require("randomstring");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "divyashewale1582003@gmail.com",
    pass: "pyyp qhhk dnpu bhvz",
  },
});

const userData = {};

router.post("/generate-otp", (req, res) => {
  const { email } = req.body;

  const otp = randomstring.generate({ length: 6, charset: "numeric" });

  userData[email] = { otp };

  const mailOptions = {
    from: "divyashewale1582003@gmail.com",
    to: email,
    subject: "Your OTP for E-commerce Email Verification",
    html: `
  
    <p>Your verification OTP for E_comm has been successfully sent.</p>
    <p>Your Verification otp is ${otp}.</p>
    <p>If you have any issues, \n contact our support team.</p>
     <p><strong>Thank You,</strong></p>
    <p>YuvaSarathi Team</p>`,
  };

 
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to send OTP" });
        }
        console.log("Email sent: " + info.response);
        res.json({ success: true, message: "OTP sent successfully" });
      });
});
*/
const sendEmail = asyncHandler (async ( data, req, res) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MP,
         
        },
      });
      

      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"HEYYY 👻" <abc@gmail.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.htm, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      main().catch(console.error);
})

module.exports = sendEmail