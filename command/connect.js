
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
        
      const args = String(message.content).split(/ +/);
     
        connection.connect()
        connection.query(
            `insert into BotConnection (requestserver,requestchannel,requestserverid,requestchannelid,responseserverid,responsechannelid) values ('${message.channel.guild.name}','${message.channel.name}','${message.guild.id}','${message.channel.id}','${args[1]}','${args[2]}')`
          );
          message.channel.send("해당 채널과 연결되었어요!")
          connection.query(
            `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
            ('${message.channel.guild.name}','${message.channel.name}','${message.author.id +' #' +message.author.discriminator}',
            '${insertTime}','${message.content}','OK','')`
          );

        }    


        module.exports = connect