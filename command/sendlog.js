const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
function sendLog(){
    try{
  
        message.reply({ files: ['/home/consolekakao/.pm2/logs/bot-error.log'] })
   
  }
  catch(e){console.log(e)}



}

module.exports = sendLog;