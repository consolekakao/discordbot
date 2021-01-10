const { default: axios } = require("axios");
const Discord = require("discord.js");
const  mysql = require("mysql");
const  prefix = ["노운아!","저장!","도와줘!","내전적!"];
const config = require("./config.json");
const client = new Discord.Client();
let apikey = config.bagapikey;
let connection = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
});

client.once("ready", () => {
  let now = new Date();
  console.log(`■□■□■□■□■□■□■□  BOT READY! ${now} ■□■□■□■□■□■□■□■□■□ `);
  client.user.setActivity(`${now.getHours()}시 ${now.getMinutes()}분에 부활`);
});

client.once("reconnecting", () => {
  console.log("■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□  BOT Reconnecting!");
});

client.once("disconnect", () => {
  console.log("■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□■□  BOT Disconnect!");
});

connection.connect();

try{
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith("노운아!") && !message.content.startsWith("저장!") && !message.content.startsWith("내전적!") && !message.content.startsWith("도와줘!")&& !message.content.startsWith("!채널추가")&& !message.content.startsWith("!채널삭제") && !message.content.startsWith("핵쟁이추가!")&& !message.content.startsWith("핵쟁이조회!") && !message.content.startsWith("help!")) return;
  const now = new Date();
  const insertTime = `${now.getFullYear()}-${Number(now.getMonth())+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  console.log(`user:${message.author.id} server:${message.channel.guild.name} channel:${message.channel.name}`);
  console.log(`channelid:${message.channel.id} request: ${message.content} time:${insertTime}`)
  console.log(`￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣`);
  if (message.content.startsWith(`노운아!`)) {
    const args = message.content.slice(prefix.length).split(/ +/);
    connection.query(
      `SELECT * FROM BotChannel where channelid = "${message.channel.id}"`,
     async function (err, rows) {
        try {
          if (err) throw err;
          if(rows[0] ) await search(args[1],message);
          else return;
          
        } catch (error) {
          console.error(error);
        }
      }
    );
    
    return;
  }
   else if (message.content.startsWith(`!채널추가`) && (message.channel.guild.ownerID == message.author.id || message.author.id == `526415286358769664`)) {
     
    connection.query(
      `insert into BotChannel (servername,channelname,channelid) values ('${message.channel.guild.name}','${message.channel.name}','${message.channel.id}')`
    );
    message.channel.send("이 채팅방은 이제 노운이를 사용할 수 있어요.")
        return;
   }

   else if (message.content.startsWith(`!채널삭제`) && (message.channel.guild.ownerID == message.author.id || message.author.id == `526415286358769664`)) {
    connection.query(
      `delete from BotChannel where channelid = '${message.channel.id}'`
    );
    message.channel.send("이 채팅방은 이제 노운이를 사용할 수 없어요.")
        return;
   }

   else if (message.content.startsWith(`저장!`)) {
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
   else if (message.content.startsWith(`내전적!`)) {
     
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
   else if(message.content == `도와줘!` || message.content == `help!`){
    const notCommand = new Discord.MessageEmbed()
    .setColor("#ff0022")
    if(message.channel.guild.ownerID == message.author.id ){
      notCommand.addFields(
        {name: `# 관리자 명령어`,value:`\u200b`},
       { name: `\`!채널추가\``, value: `이제 이 채팅방에서 노운이를 사용할 수 있어요.` },
       { name: `\`!채널삭제\``, value: `이제 이 채팅방에서 노운이를 사용할 수 없어요.` }
        )
    }
   notCommand.addField('\u200b', '\u200b')
    notCommand.addFields(
      { name: `# 사용자 명령어`,value:`\u200b`},
      { name: `\`노운아! <Player>\``, value: `해당 ID의 전적을 불러와요.` },
      { name: `\`저장! <Player>\``, value: `해당 ID를 노운이에게 저장해요.`},
      { name: `\`내전적!\``, value: `저장된 ID의 검색 결과를 불러와요.` },
      { name: `\`핵쟁이조회! <Player>\``, value: `노운이가 소속되어있는 서버의 제보로 핵쟁이를 검색해요.\n 풀네임을 입력하지 않아도 괜찮아요.` },
      { name: `\`핵쟁이추가! <Player>\``, value: `상대방의 핵이 의심된다면 추가해주세요.\n 신고 누적 3회 이상이면 핵쟁이로 등록!` },
      { name: `\`도와줘!\` or \`help!\``, value: `노운이 명령어를 확인할 수 있어요.` }
    )
    .setThumbnail('https://media.discordapp.net/attachments/793834376017215558/793844780626608148/known2.png?width=541&height=514')
    

   connection.query(
    `SELECT * FROM BotChannel where channelid = "${message.channel.id}"`,
   async function (err, rows) {
      try {
        if (err) throw err;
        if(rows[0] ) message.reply('',notCommand)
        else {
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }
  );
    return;
   }


   else if(message.content.startsWith(`핵쟁이조회!`)){
    
     let msg = message.content.slice(7);
     if(msg.length <5){message.channel.send(`검색 문자가 너무 짧습니다. 5글자 이상 입력해 주세요`); return;}
   connection.query(
    `SELECT * FROM BotChannel where channelid = "${message.channel.id}"`,
   async function (err, rows) {
      try {
        if (err) throw err;
        if(rows[0] ) { //사용가능 채널일때
        await connection.query(
            `SELECT count(*) as cnt,nick FROM BotHack where nick LIKE "${msg}%" group by nick`,
           async function (err, rowsss) {
              try {
                if (err) throw err;
                let guess = 0;
                let hack = 0;
               if(rowsss.length > 0) { 
                  for(let i=0;i<rowsss.length;i++){
                    rowsss[i].cnt >= 3 ? hack++ : guess++; 
                  }
                  message.channel.send(`의심${guess}건 확신${hack}건 검색되네요. \n검색 결과는 개인 DM을 확인해주세요.`)
                  let guessdata = [];
                  let hackdata = [];
                await connection.query(
                    `select count(*) as cnt,nick from BotHack where nick LIKE "${msg}%"  group by nick limit 100`,async function(err,result){
                      try{
                        if(err) console.log(err)
                      for(let i =0; i<result.length;i++){
                        result[i].cnt >= 3 ? await hackdata.push(`${decodeURI(result[i].nick)} [${result[i].cnt}]`) : await guessdata.push(`${decodeURI(result[i].nick)} [${result[i].cnt}]`)
                        }
                      }
                      catch{
                        console.log("err",err)
                      }
                    }
                  );
                 await message.author.send(`검색 결과는 다음과 같아요!\n의심유저 [신고횟수]`);
                 await message.author.send(guessdata);
                 await message.author.send(`핵쟁이 [신고횟수]`)
                 await message.author.send(hackdata)
                  message.channel.send(`\`위 데이터는 단순 참고용 자료이며 PUBG에서 검증된 자료가 아닙니다.\``)
                connection.query(
                    `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
                    ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
                    '${insertTime}','${message.content}','OK','')`
                  );
                  return;
                }

                else {
                  message.channel.send(`신고 결과가 없네요.`)
                  connection.query(
                    `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
                    ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
                    '${insertTime}','${message.content}','-','NOT_SELECT')`
                  );
                  return;
                }
              } catch (error) {
                console.error(error);
              }
            }
          );    
        }
        else {
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }
  );
    return;
   }


   else if(message.content.startsWith(`핵쟁이추가!`)){
    let msg = message.content.slice(7);
  connection.query(
   `SELECT * FROM BotChannel where channelid = "${message.channel.id}"`,
  async function (err, rows) {
     try {
       if (err) throw err;
       if(rows[0] ) { //사용가능 채널일때
         connection.query(
           `insert into BotHack (nick) value ("${msg}")`
         );    
         message.channel.send(`${msg}를 신고했어요. 누적 신고내역이 3건 이상이면 핵쟁이 리스트에 등록됩니다.`)
         connection.query(
          `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
          ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
          '${insertTime}','${message.content}','OK','')`
        );
       }
       else {
        connection.query(
          `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
          ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
          '${insertTime}','${message.content}','-','NOT_ADD_HACK')`
        );
         return;
       }
     } catch (error) {
       console.error(error);
     }
   }
 );
   return;
  }





return;
}
);

async function search(id,message,insertTime){
  let findAccountCode,resultSeason,season;
   
  try{
  findAccountCode = await axios( //account id
    {
      url:`https://api.pubg.com/shards/kakao/players?filter[playerNames]=${id}`,
      headers:{
        'Authorization': `Bearer ${apikey}`,
        'Accept': 'application/vnd.api+json'
      },
      timeout:2000  
    }
  )
  }
  
  catch(e){
  }
  if(!findAccountCode?.data?.data[0]?.id){
    const resultReply = new Discord.MessageEmbed()
    .setColor("#ff0022")
    .setTitle(`${id}의 전적 검색 결과가 없어용.`)
    .setThumbnail('https://media.discordapp.net/attachments/793834376017215558/793844780626608148/known2.png?width=541&height=514')
    .setFooter('PUBG 서버로부터 실시간 제공 받은 자료입니다.',"https://media.discordapp.net/attachments/793834376017215558/793844780626608148/known2.png?width=541&height=514")
    message.reply('',resultReply)
   
connection.query(
  `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
  ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
  now(),'${message.content}','-','404_NOT FOUND_USER')`
);
    return;
  }
    try{
    resultSeason = await axios( //season
      {
        url:`https://api.pubg.com/shards/kakao/players/${findAccountCode?.data?.data[0]?.id}/seasons/division.bro.official.pc-2018-10/ranked`,
        headers:{
          'Authorization': `Bearer ${apikey}`,
          'Accept': 'application/vnd.api+json'
        },
        timeout:2000 
      }
    )
      status = "200";
  }
    catch(e){
    }
   season = await axios( //일반게임 현재시즌 통계
    {
      url:`https://api.pubg.com/shards/kakao/players/${findAccountCode?.data?.data[0]?.id}/seasons/division.bro.official.pc-2018-10`,
      headers:{
        'Authorization': `Bearer ${apikey}`,
        'Accept': 'application/vnd.api+json'
      },
      timeout:2000  
    }
  )
let result = {}
let rankSolo = {
  currentTier:{             //현재 티어
    tier : "NO DATA",
    subTier : ""}, 
    currentRankPoint: "",  //현재 랭크점수
    bestTier: { tier: '', subTier: '' },   //최대 티어
    bestRankPoint: '',  //최대 랭크 점수
    roundsPlayed: '', // 게임 횟수
    avgRank:'', //평균 등수
    kda:'', //KDA
    kills:'', //킬
    deaths:'', //데스
    assist:'', //어시스트
    damageDealt: '' //누적 데미지
  }

  let rankSquad = {
    currentTier:{             //현재 티어
      tier : "NO DATA",
      subTier : ""}, 
      currentRankPoint: "",  //현재 랭크점수
      bestTier: { tier: '', subTier: '' },   //최대 티어
      bestRankPoint: '',  //최대 랭크 점수
      roundsPlayed: '', // 게임 횟수
      avgRank:'', //평균 등수
      kda:'', //KDA
      kills:'', //킬
      deaths:'', //데스
      assist:'', //어시스트
      damageDealt: '' //누적 데미지
    }

    let squad,duo,solo = {
      kills:'',
      losses:'',
      damageDealt:'',
      roundsPlayed:'',
      wins:'',
      avgDemage:'',
      avgKill:''
    }
if(resultSeason?.data?.data?.attributes?.rankedGameModeStats?.solo) {rankSolo = resultSeason.data.data.attributes.rankedGameModeStats.solo;}
if(resultSeason?.data?.data?.attributes?.rankedGameModeStats?.squad) {rankSquad = resultSeason.data.data.attributes.rankedGameModeStats.squad;}
if(season?.data?.data?.attributes?.gameModeStats?.squad) {squad = season.data.data.attributes.gameModeStats.squad;}
if(season?.data?.data?.attributes?.gameModeStats?.duo) {duo = season.data.data.attributes.gameModeStats.duo;}
if(season?.data?.data?.attributes?.gameModeStats?.solo) {solo = season.data.data.attributes.gameModeStats.solo;}


if(rankSolo.currentTier.tier != "NO DATA"){
  let avgDill = Number(rankSolo.damageDealt)/Number(rankSolo.roundsPlayed);
      avgDill = String(avgDill).slice(0,5);
      rankSolo.kda = String(rankSolo.kda).slice(0,4);
      rankSolo.avgRank = String(rankSolo.avgRank).slice(0,4)
      rankSolo.top10Ratio = rankSolo.top10Ratio*100;
      rankSolo.top10Ratio = String(rankSolo.top10Ratio).slice(0,4) + '%';
      rankSolo.winRatio = rankSolo.winRatio*100;
      rankSolo.winRatio = String(rankSolo.winRatio).slice(0,4) + '%';
result.rankSolo = `
:trophy:${rankSolo.currentTier.tier} ${rankSolo.currentTier.subTier} : ${rankSolo.currentRankPoint}RP
최고티어: ${rankSolo.bestTier.tier}${rankSolo.bestTier.subTier} : ${rankSolo.bestRankPoint}RP
게임 수: ${rankSolo.roundsPlayed} 
KDA: ${rankSolo.kda}
평딜: ${avgDill}
평균 순위: ${rankSolo.avgRank}
탑10: ${rankSolo.top10Ratio}
승률: ${rankSolo.winRatio}
`
}
else{
  result.rankSolo = `NO DATA`
}
if(rankSquad.currentTier.tier !== "NO DATA"){
  let avgDill = Number(rankSquad.damageDealt)/Number(rankSquad.roundsPlayed);
      avgDill = String(avgDill).slice(0,5);
      rankSquad.kda = String(rankSquad.kda).slice(0,4);
      rankSquad.avgRank = String(rankSquad.avgRank).slice(0,4)
      rankSquad.top10Ratio = rankSquad.top10Ratio*100;
      rankSquad.top10Ratio = String(rankSquad.top10Ratio).slice(0,4) + '%';
      rankSquad.winRatio = rankSquad.winRatio*100;
      rankSquad.winRatio = String(rankSquad.winRatio).slice(0,4) + '%';
      
  result.rankSquad = `
  :trophy:${rankSquad.currentTier.tier} ${rankSquad.currentTier.subTier} : ${rankSquad.currentRankPoint}RP
  최고티어: ${rankSquad.bestTier.tier}${rankSquad.bestTier.subTier} : ${rankSquad.bestRankPoint}RP
  게임 수: ${rankSquad.roundsPlayed} 
  KDA: ${rankSquad.kda}
  평딜: ${avgDill}
  평균 순위: ${rankSquad.avgRank}
  탑10: ${rankSquad.top10Ratio}
  승률: ${rankSquad.winRatio}
  `
  }
  else{
    result.rankSquad = `NO DATA`
  }
  if(squad.kills !==''){
    let kda = (Number(squad.kills)+Number(squad.assists))/Number(squad.losses);
    kda = (String(kda).slice(0,3)) 
    let winGamePercent = Number(squad.wins)/Number(squad.roundsPlayed)*100;
    winGamePercent = String(winGamePercent).slice(0,3) + '%'
    let avgDill = Number(squad.damageDealt)/Number(squad.roundsPlayed);
    avgDill = String(avgDill).slice(0,5) 
    if(kda == "NaN") kda = "-";
    if(winGamePercent == "NaN%") winGamePercent = "-";
    if(avgDill == "NaN") avgDill = "-"
    result.squad = `
    KDA: ${kda}
    평딜: ${avgDill}
    승률: ${winGamePercent}
    `
    }
    else{
      result.squad = `NO DATA`
    }
  if(duo.kills !==''){
      let kda = (Number(duo.kills)+Number(duo.assists))/Number(duo.losses);
      kda = String(kda).slice(0,3) 
      let winGamePercent = Number(duo.wins)/Number(duo.roundsPlayed)*100;
      winGamePercent = String(winGamePercent).slice(0,3) + '%'
      let avgDill = Number(duo.damageDealt)/Number(duo.roundsPlayed);
      avgDill = String(avgDill).slice(0,5)
      if(kda == "NaN") kda = "-";
      if(winGamePercent == "NaN%") winGamePercent = "-";
      if(avgDill == "NaN") avgDill = "-" 
      result.duo = `
      KDA: ${kda}
      평딜: ${avgDill}
      승률: ${winGamePercent}
      `                       
      }
      else{
        result.duo = `NO DATA`
      }

  if(solo.kills !==''){
        let kda = (Number(solo.kills))/Number(solo.losses);
        kda = String(kda).slice(0,3)
        let winGamePercent = Number(solo.wins)/Number(solo.roundsPlayed)*100;
        winGamePercent = String(winGamePercent).slice(0,3) + '%'
        let avgDill = Number(solo.damageDealt)/Number(solo.roundsPlayed);
        avgDill = String(avgDill).slice(0,5)  
        if(kda == "NaN") kda = "-";
        if(winGamePercent == "NaN%") winGamePercent = "-";
        if(avgDill == "NaN") avgDill = "-"
        result.solo = `
        KDA: ${kda}
        평딜: ${avgDill}
        승률: ${winGamePercent}
        `
        }
        else{
          result.solo = `NO DATA`
        }

const resultReply = new Discord.MessageEmbed()
.setColor("#0ab1ff")
.setTitle(`${id} 전적 검색 결과에용`)
.addFields({name:`\`솔로\``,value:
`
${result.solo}
`,inline:true},
{
  name:`\`듀오\``,value:`
${result.duo}`,inline:true
},
{
  name:`\`스쿼드\``,value:`
${result.squad}
  `,inline:true
}
)
.addFields({name:`\`랭크 솔로\``,value:`
${result.rankSolo}`,inline:true},
{name:`\`랭크 스쿼드\``,value:`
${result.rankSquad}`,inline:true})

.setThumbnail("https://media.discordapp.net/attachments/793834376017215558/793844780626608148/known2.png?width=541&height=514")
.setFooter('위 자료는 PUBG로부터 실시간 전송 받은 자료입니다.',"https://media.discordapp.net/attachments/793834376017215558/793844780626608148/known2.png?width=541&height=514")
message.reply('',resultReply)
connection.query(
  `insert into BotLog (servername,channelname,usernick,time,usecommand,status) values 
  ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
  now(),'${message.content}','OK')`
);
}
}
catch(e){
  let time = new Date();
  console.log(`★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ err ★★★★★★★★★★★★★`);
  console.log(time);
}



client.login(config.discordapikey);