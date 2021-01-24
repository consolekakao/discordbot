
function unuseKnown(message){
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
            `delete from BotChannel where channelid = '${message.channel.id}'`
          );
          message.channel.send("이 채팅방은 이제 노운이를 사용할 수 없어요.")


        }    


        module.exports = unuseKnown