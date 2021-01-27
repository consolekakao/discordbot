const Discord = require("discord.js");
const fs = require('fs');
async function sendLog(message,number,insertTime){
    try{
        let date = new Date();
        let time = date.getMonth()+1
        if(number == "1")
        {
            
           message.reply({files:['/home/consolekakao/.pm2/logs/bot-error.log'] });
           await fs.unlinkSync('/home/consolekakao/.pm2/logs/bot-error.log')
           await fs.writeFileSync('/home/consolekakao/.pm2/logs/bot-error.log',`${insertTime}`,function(err){if(err === null)console.log("에러로그 정상출력")})
        
        if(number == "2")
        {
           message.reply({ files: ['/home/consolekakao/.pm2/logs/bot-out.log']})
           await fs.unlinkSync('/home/consolekakao/.pm2/logs/bot-out.log')
           await fs.writeFileSync('/home/consolekakao/.pm2/logs/bot-out.log',`${insertTime}`,function(err){if(err === null)console.log("봇로그 정상출력")})
        }
   
  }
}
  catch(e){console.log(e); message.reply(`issue => ,${e}`)}



}

module.exports = sendLog;