
function saveNick(message,insertTime){
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
        const nickname = message.content.slice(4);
        
        connection.query(
          `SELECT * FROM BotSaveNick where userid = "${message.author.id}"`,
         async function (err, rows) {
            try {
              if (err) throw err;
              if(rows[0]) { //이미 등록한 아이디가 있는 경우.
                connection.query(
                  `update BotSaveNick set savename = "${nickname}" where userid = "${message.author.id}"`
                );
                message.channel.send(`기존에 있던 아이디를 ${nickname} 으로 변경했어요!`)
    
                connection.query(
                  `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
                  ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
                  '${insertTime}','${message.content}','OK','')`
                );
                return;
              }
              else { //아직 등록한 아이디가 없는경우
                connection.query(
                  `insert into BotSaveNick (userid,savename) values ("${message.author.id}","${nickname}")`
                );
                message.channel.send(`아이디를 저장했어요. 이제 내전적! 이라고 외쳐주세요!.`)
                
                connection.query(
                  `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
                  ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
                  '${insertTime}','${message.content}','OK','')`
                );
                return;
              }
            } catch (error) {
              console.error(error);
            }
          }
        );







        }    


        module.exports = saveNick