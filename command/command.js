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
<<<<<<< HEAD
            {name: `# 노운이 사용 명령어`,value:`\u200b`},
            { name: `\`!채널추가\``, value: `이제 이 채팅방에서 노운의 모든 기능을 사용할 수 있어요.` },
            { name: `\`!채널삭제\``, value: `이제 이 채팅방에서 노운이를 사용할 수 없어요.` },
            {name:`\u200b`,value:`\u200b`},
            { name: `# 연합채널 연동`,value:`연합채널 연동이란? \n 타 클랜과 디스코드 정보없이 오로지 게임 내 닉네임만으로 \n소통하는 노운이만의 시스템이에요.\n상대 채널에는 우리 서버명, 내 게임닉네임만 표시됩니다.\n방장이 지정한 특정 채널에서만 사용 가능하며 사용전 \n\`저장! 닉네임\` 명령어를 통해 아이디를 먼저 등록해주세요.
            \n방장은 연결을 원하는 상대 서버의 방장이 \`서버정보\` 명령어를 \n사용해 연결 키 값을 두개 받을 수 있어요.
            \n해당 키를 받아서 연동을 원하는 채팅채널에서 \n\`!커넥트 서버ID 채널ID\`  명령어를 입력하면 됩니다.\n<상대 서버에서도 똑같이 진행해주어야 연동됩니다.>
            
            `},
            
            {name: `\`!서버정보\``, value: `연합채널 연동시 필요한 정보를 알려줘요. `  },
            {name: `\`!커넥트 <대상서버ID> <대상채널ID>\``, value: `해당 연합 채널과 연동됩니다. \n 연합 채널에는 익명으로 자신의 서버명과 랜덤한 아이디만 노출됩니다.\n서버 및 채널 ID 찾기는 \`!서버정보\` 입력!\n\`ex)!커넥트 705489046557818915 802482821477564421\``  },
            {name: `\`!디스커넥트 <대상서버ID> <대상채널ID>\``, value: `해당 연합 채널과의 채팅을 끊습니다.\n\`ex)!커넥트 705489046557818915 802482821477564421\``  },
            {name: `+ 패시브 효과`, value: `연합 서버들과의 채팅시 URL이 노출되거나 영입 시도를 하는  \n행위는 봇이 사전 차단 및 관리자에게 보고 합니다.`  },
            {name:`\u200b`,value:`\u200b`},
            { name: `# 사용자 명령어`,value:`\u200b`},
           { name: `\`노운아! <Player>\``, value: `해당 ID의 전적을 불러와요.` },
           { name: `\`저장! <Player>\``, value: `해당 ID를 노운이에게 저장해요.`},
           { name: `\`내전적!\``, value: `저장된 ID의 검색 결과를 불러와요.` },
           { name: `\`핵쟁이조회! <Player>\``, value: `노운이가 소속되어있는 서버의 제보로 핵쟁이를 검색해요.\n 풀네임을 입력하지 않아도 괜찮아요.` },
           { name: `\`핵쟁이추가! <Player>\``, value: `상대방의 핵이 의심된다면 추가해주세요.\n 신고 누적 3회 이상이면 핵쟁이로 등록!` },
           { name: `\`도와줘!\` or \`help!\``, value: `노운이 명령어를 확인할 수 있어요.` },
           { name: `\`팀배정! <한 팀당 인원수> <멤버A> <멤버B> <멤버C> ...\``, value: `랜덤으로 팀을 꾸려줘요.\nex) 팀배정! 2 멤버A 멤버B 멤버C 멤버D 멤버E 멤버F` },
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
                  message.author.send('',notCommand);
                  message.reply('명령어 목록을 개인DM으로 보냈어요!')
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