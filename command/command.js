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
            {name: `# 관리자 명령어`,value:`\u200b`},
           { name: `\`!채널추가\``, value: `이제 이 채팅방에서 노운이를 사용할 수 있어요.` },
           { name: `\`!채널삭제\``, value: `이제 이 채팅방에서 노운이를 사용할 수 없어요.` },
           {name: `\`!커넥트 <대상서버ID> <대상채널ID>\``, value: `해당 연합 채널과 연동됩니다. \n 연합 채널에는 익명으로 자신의 서버명과 랜덤한 아이디만 노출됩니다.\n서버 및 채널 ID는 서버 우클릭 또는 채팅채널 우클릭시 ID복사하기를 이용해주세요. `  },
           {name: `\`!디스커넥트  <대상서버ID> <대상채널ID>\``, value: `해당 연합 채널과의 채팅을 끊습니다.`  },
           {name: `# 패시브 효과`, value: `연합 서버들과의 채팅시 URL이 노출되거나 영입 시도를 하는 행위는 \n봇이 사전 차단 및 관리자에게 보고 합니다.`  },
           {name:`\u200b`,value:`\u200b`},
           { name: `# 사용자 명령어`,value:`\u200b`},
          { name: `\`노운아! <Player>\``, value: `해당 ID의 전적을 불러와요.` },
          { name: `\`저장! <Player>\``, value: `해당 ID를 노운이에게 저장해요.`},
          { name: `\`내전적!\``, value: `저장된 ID의 검색 결과를 불러와요.` },
          { name: `\`핵쟁이조회! <Player>\``, value: `노운이가 소속되어있는 서버의 제보로 핵쟁이를 검색해요.\n 풀네임을 입력하지 않아도 괜찮아요.` },
          { name: `\`핵쟁이추가! <Player>\``, value: `상대방의 핵이 의심된다면 추가해주세요.\n 신고 누적 3회 이상이면 핵쟁이로 등록!` },
          { name: `\`도와줘!\` or \`help!\``, value: `노운이 명령어를 확인할 수 있어요.` },
          { name: `\`팀배정! <한 팀당 인원수> <멤버1> <멤버2> <멤버3> ...\``, value: `랜덤으로 팀을 꾸려줘요.\nex) 팀배정! 3 멤버A 멤버B 멤버C` },
          {name:`\u200b`,value:`\u200b`},
          { name: `# 개발자에게 문의하기`, value: `개발자에게 문의를 남길 수 있어요.\nMail: console@kakao.com \nDiscord 노운이친구#9736 \n답변을 원할 경우 메일로 문의주세요.` }
        )
        .setThumbnail('https://media.discordapp.net/attachments/793834376017215558/793844780626608148/known2.png?width=541&height=514')






        connection.query(
            `SELECT * FROM BotChannel where channelid = "${message.channel.id}"`,
           async function (err, rows) {
              try {
                if (err) throw err;
                if(rows[0] ){ 
                  message.reply('',notCommand)
                await connection.query(
                  `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
                  ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
                  '${insertTime}','${message.content}','OK','')`
                );
              }
                else {
                  await  connection.query(
                    `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
                    ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
                    '${insertTime}','${message.content}','-','NO_HELP')`
                  );
                  return;
                }
              } catch (error) {
                console.error(error);
              }
            }
          );



        }    


        module.exports = command