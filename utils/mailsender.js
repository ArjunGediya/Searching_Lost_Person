const nodemailer = require("nodemailer")
require("dotenv").config();

const mailSender = (email,otp)=>{
    try{
    const transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        }
    })
    let info = transporter.sendMail({
        from:`LostFindr - by Arjun Gediya`,
        to:`${email}`,
        subject:`verificationation By LostFindr`,
        html:`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>LostFindr OTP Verification Email</title>
            <style>
                /* CSS styles for email decoration */
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    padding: 20px;
                    text-align: center; /* Center align text */
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #333333;
                }
                p {
                    color: #666666;
                }
                img.logo {
                    display: block;
                    margin: 0 auto; /* Center align the image */
                    max-width: 200px;
                    height: auto; /* Maintain aspect ratio */
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="" class="logo">
                
                <div style="text-align: center;">
                    <h2>OTP Verification Email</h2>
                    <p>Dear User,</p>
                </div>
                <div style="text-align: center;">
                    <p>Thank you for registering with LostFindr. To complete your registration, please use the following OTP (One-Time Password) to verify your account:</p>
                    <h2>${otp}</h2>
                    <p>This OTP is valid for 5 minutes. If you did not request for this verification, please disregard this email. Once your account is verified, you will have access to our platform and its features.</p>
                </div>
            </div>
        </body>
        </html>
        `
    })
    return info;
    }catch(err){
        console.log("error in sending mail  ",err);
    }
}

module.exports = mailSender

