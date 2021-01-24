
function connect(message,insertTime){
    const Discord = require("discord.js");
    const  mysql = require("mysql");
    const client = new Discord.Client();
    const config = require("../config.json");
    let connection = mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
      });
        
        connection.connect()
        connection.query(
            `insert into connectbotlist (servername,channelname,serverid,channelid) values ('${message.channel.guild.name}','${message.channel.name}','${message.guild.id}','${message.channel.id}')`
          );
          message.channel.send("연합채널들과 연결되었어요!")
          connection.query(
            `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
            ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
            '${insertTime}','${message.content}','OK','')`
          );

        }    


        module.exports = connect