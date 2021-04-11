function command(message,insertTime){
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
    
        const notCommand = new Discord.MessageEmbed()
        .setColor("#ff0022")
        
          notCommand.addFields(
            { name: `# 사용자 명령어`,value:`\u200b`},
           { name: `\`!전적 <Player>\``, value: `해당 ID의 전적을 불러와요.` },
           { name: `\`!저장 <Player>\``, value: `해당 ID를 노운이에게 저장해요.`},
           { name: `\`!내전적\``, value: `저장된 ID의 검색 결과를 불러와요.` },
           { name: `\`!help\``, value: `노운이 명령어를 확인할 수 있어요.` },
           { name: `\`!팀배정 <한 팀당 인원수> <멤버A> <멤버B> <멤버C> ...\``, value: `랜덤으로 팀을 꾸려줘요.\nex) 팀배정! 2 멤버A 멤버B 멤버C 멤버D 멤버E 멤버F` },
           {name:`\u200b`,value:`\u200b`},
           {name: `# 관리자 명령어`,value:`\u200b`},
            { name: `\`!채널추가\``, value: `이제 이 채팅방에서 노운의 모든 기능을 사용할 수 있어요.` },
            { name: `\`!채널삭제\``, value: `이제 이 채팅방에서 노운이를 사용할 수 없어요.` },
            {name:`\u200b`,value:`\u200b`},
           {name:`\u200b`,value:`\u200b`},
           { name: `# 개발자에게 문의하기`, value: `개발자에게 문의를 남길 수 있어요.\nMail: console@kakao.com \nDiscord 노운이개발자#9736 \n답변을 원할 경우 메일로 문의주세요.` }

        )
        .setThumbnail('https://media.discordapp.net/attachments/793834376017215558/793844780626608148/known2.png?width=541&height=514')

        connection.query(
            `SELECT * FROM BotChannel where channelid = "${message.channel.id}"`,
           async function (err, rows) {
              try {
                if (err) throw err;
                if(rows[0] ){ 
                  message.author.send('',notCommand);
                  message.reply('명령어 목록을 개인DM으로 보냈어요!')
              }
                else {
                  return;
                }
              } catch (error) {
                console.error(error);
              }
            }
          );



        }    


        module.exports = command