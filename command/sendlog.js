const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
function sendLog(message,number){
    try{
        if(number == "1")message.reply({ files: ['/home/consolekakao/.pm2/logs/bot-error.log'] })
        if(number == "2")message.reply({ files: ['/home/consolekakao/.pm2/logs/bot-out.log']})
   
  }
  catch(e){console.log(e)}



}

module.exports = sendLog;