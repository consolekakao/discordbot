/**
 *
 * !채널추가 명령어
 *
 */
function useKnown(message){
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
            `insert into BotChannel (servername,channelname,channelid) values ('${message.channel.guild.name}','${message.channel.name}','${message.channel.id}')`
          );
        message.channel.send("이 채팅방은 이제 노운이를 사용할 수 있어요.");


        }    


        module.exports = useKnown