const Discord = require("discord.js");
const fs = require('fs');
async function sendLog(message,number){
    try{
        if(number == "1")
        {
           await message.reply({ files: ['/home/consolekakao/.pm2/logs/bot-error.log'] })
           await fs.unlinkSync('/home/consolekakao/.pm2/logs/bot-error.log')
           await fs.writeFileSync('/home/consolekakao/.pm2/logs/bot-error.log')
        }
        if(number == "2")
        {
           await message.reply({ files: ['/home/consolekakao/.pm2/logs/bot-out.log']})
           await fs.unlinkSync('/home/consolekakao/.pm2/logs/bot-out.log')
           await fs.writeFileSync('/home/consolekakao/.pm2/logs/bot-out.log')
        }
   
  }
  catch(e){console.log(e); message.reply(`issue => ,${e}`)}



}

module.exports = sendLog;