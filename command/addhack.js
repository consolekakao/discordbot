async function addHack(message,insertTime){
    const Discord = require("discord.js");
const  mysql = require("mysql");
const config = require("../config.json");
let connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });


  let msg = message.content.slice(7);
  connection.query(
   `SELECT * FROM BotChannel where channelid = "${message.channel.id}"`,
  async function (err, rows) {
     try {
       if (err) throw err;
       if(rows[0] ) { //사용가능 채널일때
         connection.query(
           `insert into BotHack (nick) value ("${msg}")`
         );    
         message.channel.send(`${msg}를 신고했어요. 누적 신고내역이 3건 이상이면 핵쟁이 리스트에 등록됩니다.`)
         connection.query(
          `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
          ('${message.channel.guild.name}','${message.channel.name}','${message.author.id +' #' +message.author.discriminator}',
          '${insertTime}','${message.content}','OK','')`
        );
       }
       else {
        connection.query(
          `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
          ('${message.channel.guild.name}','${message.channel.name}','${message.author.id +' #' +message.author.discriminator}',
          '${insertTime}','${message.content}','-','NOT_ADD_HACK')`
        );
         return;
       }
     } catch (error) {
       console.error(error);
     }
   }
 );


}

module.exports = addHack;