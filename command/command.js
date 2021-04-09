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
           { name: `\`노운아! <Player>\``, value: `해당 ID의 전적을 불러와요.` },
           { name: `\`저장! <Player>\``, value: `해당 ID를 노운이에게 저장해요.`},
           { name: `\`내전적!\``, value: `저장된 ID의 검색 결과를 불러와요.` },
           { name: `\`핵쟁이조회! <Player>\``, value: `노운이가 소속되어있는 서버의 제보로 핵쟁이를 검색해요.\n 풀네임을 입력하지 않아도 괜찮아요.` },
           { name: `\`핵쟁이추가! <Player>\``, value: `상대방의 핵이 의심된다면 추가해주세요.\n 신고 누적 3회 이상이면 핵쟁이로 등록!` },
           { name: `\`도와줘!\` or \`help!\``, value: `노운이 명령어를 확인할 수 있어요.` },
           { name: `\`팀배정! <한 팀당 인원수> <멤버A> <멤버B> <멤버C> ...\``, value: `랜덤으로 팀을 꾸려줘요.\nex) 팀배정! 2 멤버A 멤버B 멤버C 멤버D 멤버E 멤버F` },
           {name:`\u200b`,value:`\u200b`},
           {name: `# 관리자 명령어`,value:`\u200b`},
            { name: `\`!채널추가\``, value: `이제 이 채팅방에서 노운의 모든 기능을 사용할 수 있어요.` },
            { name: `\`!채널삭제\``, value: `이제 이 채팅방에서 노운이를 사용할 수 없어요.` },
            {name:`\u200b`,value:`\u200b`},
            { name: `# 연합채널 연동`,value:`연합채널 연동이란? \n노운이를 초대한 서버들은 새로운 서버를 생성하지 않아도\n각자의 서버 안에서 서로 소통할 수 있어요!\n디스코드 개인 프로필 없이 소통하는 노운이만의 시스템이에요.\n상대 채널에는 우리 서버명 + 게임닉네임만 표시됩니다.\n방장이 지정한 특정 채널에서만 사용 가능하며 \n(새로운 채팅채널 생성 필수) \n사용전 \`저장! <Player>\` 명령어를 통해 본인 아이디를 먼저 \n등록한 사람만 해당 기능을 사용할 수 있어요.\n\n`},
            {name:`+연합채널 채팅방 설정방법`,value:`노운이를 통해 연합채널을 맺으려면 상대서버의 서버ID와 채널ID가 필요해요.\n연결을 원하는 상대 서버의 관리자는 !서버정보 명령어를 통해 간단하게 정보를 알 수 있어요.\n
            해당 키를 받아서 연합채널 채팅방에\n!커넥트 <대상서버ID> <대상채널ID> 명령어를 입력하면 \n연동이 시작됩니다.\n(상대 서버에서도 똑같이 진행해주어야 연동됩니다)\nex) !커넥트 705489046557818915 802482821477564421\n   !디스커넥트 705489046557818917 802482821477564425\n`},
            
            {name: `+ 패시브 효과`, value: `연합 서버들과의 채팅시 URL이 노출되거나 영입 시도를 하는  \n행위는 봇이 사전 차단 및 관리자에게 보고 합니다.`  },
            {name:`\u200b`,value:`\u200b`},
            
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
                  ('${message.channel.guild.name}','${message.channel.name}','${message.author.id +' #' +message.author.discriminator}',
                  '${insertTime}','${message.content}','OK','')`
                );
              }
                else {
                  await  connection.query(
                    `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
                    ('${message.channel.guild.name}','${message.channel.name}','${message.author.id +' #' +message.author.discriminator}',
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