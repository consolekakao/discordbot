function useKnown(message,insertTime){
    const Discord = require("discord.js");
    const  mysql = require("mysql");
    const client = new Discord.Client();
    const search = require("../command/search.js")
    const config = require("../config.json");
    const searchInfo = require("../command/searchinfo.js")
    let connection = mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
      });
        
        connection.connect()
        connection.query(
            `SELECT * FROM BotChannel where channelid = "${message.channel.id}"`,
           async function (err, rows) {
              try {
                if (err) throw err;
                if(rows[0] ) {
                  connection.query(
                    `SELECT * FROM BotSaveNick where userid = "${message.author.id}"`,
                   async function (err, rows) {
                      try {
                        if (err) throw err;
                        if(rows[0] ) await search(encodeURI(rows[0].savename),message,insertTime);
                        else {
                          message.channel.send(`저장된 아이디가 없어요. 먼저 저장! <아이디> 명령어를 이용해 저장해주세요.`)
                          return;
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  );
                    return;
                }
                else return;
                
              } catch (error) {
                console.error(error);
              }
            }
          );


        }    


        module.exports = useKnown