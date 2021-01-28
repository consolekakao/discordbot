const Discord = require("discord.js");
const fs = require('fs');
async function sendLog(message,number,insertTime){
    try{
        let date = new Date();
        let time = date.getMonth()+1
        if(number == "1")
        {
           await message.reply({files:['/home/consolekakao/newerr.txt'] });
           await fs.unlinkSync('/home/consolekakao/newerr.txt')
           await fs.writeFileSync('/home/consolekakao/newerr.txt',`${insertTime}`,function(err){if(err === null)console.log("에러로그 정상출력")})
        }
        if(number == "2")
        {
           await message.reply({files:['/home/consolekakao/newoutput.txt'] });
           await fs.unlinkSync('/home/consolekakao/newoutput.txt')
           await fs.writeFileSync('/home/consolekakao/newoutput.txt',`${insertTime}`,function(err){if(err === null)console.log("봇로그 정상출력")})
        }
   
  
}
  catch(e){console.log(e); message.reply(`issue => ,${e}`)}



}

module.exports = sendLog;