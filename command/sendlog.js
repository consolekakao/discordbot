const Discord = require("discord.js");
const fs = require('fs');
async function sendLog(message,number,insertTime){
    try{
        let date = new Date();
        let time = date.getMonth()+1
        if(number == "1")
        {
            await fs.readFileSync('/home/consolekakao/.pm2/logs/bot-error.log','utf-8',function(err,data){
                message.reply({files:['/home/consolekakao/.pm2/logs/bot-error.log'] });
                if(data.length > 1500) data = String(data).substring(data.length-1500,data.length);
                message.channel.send(`\`${data}\``)})
           await fs.unlinkSync('/home/consolekakao/.pm2/logs/bot-error.log')
           await fs.writeFileSync('/home/consolekakao/.pm2/logs/bot-error.log',`${insertTime}`,function(err){if(err === null)console.log("에러로그 정상출력")})
        }
        if(number == "2")
        {
           await fs.readFileSync('/home/consolekakao/.pm2/logs/bot-out.log','utf-8',function(err,data){message.reply({ files: ['/home/consolekakao/.pm2/logs/bot-out.log']})})
           await fs.unlinkSync('/home/consolekakao/.pm2/logs/bot-out.log')
           await fs.writeFileSync('/home/consolekakao/.pm2/logs/bot-out.log',`${insertTime}`,function(err){if(err === null)console.log("에러로그 정상출력")})
        }
   
  }
  catch(e){console.log(e); message.reply(`issue => ,${e}`)}



}

module.exports = sendLog;