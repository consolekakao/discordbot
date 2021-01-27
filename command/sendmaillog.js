
function sendMailLog(message,insertTime){
    const Discord = require("discord.js");
    const client = new Discord.Client();
    const config = require("../config.json");
    const nodemailer = require("nodemailer");
        
      




    

    async function send(errLog) {
        // let testAccount = await nodemailer.createTestAccount();
         let transporter = nodemailer.createTransport({
           host: "smtp.gmail.com",
           port: 587,
           secure: false, // true for 465, false for other ports
           auth: {
             user: config.gmailid, // generated ethereal user
             pass: config.gmailpw, // generated ethereal password
           },
         });
       
         let info = await transporter.sendMail({
           from: '"노운이👻" <consolekakao@gmail.com>', // sender address
           to: "dbswlghks37@gmail.com", // list of receivers
           subject: "Hello ✔", // Subject line
           text: errLog, // plain text body
           html: `<b>${errLog}</b>`, // html body
         });
       
       }
       send().catch(console.error);
      



        }    


        module.exports = sendMailLog