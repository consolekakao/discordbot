const { default: axios } = require("axios");
const Discord = require("discord.js");
const  mysql = require("mysql");
const { indexOf } = require("ffmpeg-static");
const  prefix = "노운아!";
const ytdl = require("ytdl-core");
const config = require("./config.json");
const client = new Discord.Client();
const queue = new Map();
let apikey = config.bagapikey;
let connection = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
});

connection.connect();

client.once("ready", () => {
  console.log("Ready!");
  client.user.setActivity("전적 알려주기 귀찮아");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("guildMemberAdd",member =>{
const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
if(!channel) return;
channel.send(`어서와! 난 노운이!
배그 전적 검색을 하려면 <노운아! 닉네임>을 채팅에 쳐줘!`)
})


client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix) && message.channel.guild.ownerID != message.author.id) return;
  if (message.content.startsWith(`${prefix}`)) {
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
   else if (message.content.startsWith(`!채널추가`)) {
    connection.query(
      `insert into BotChannel (servername,channelname,channelid) values ('${message.channel.guild.name}','${message.channel.name}','${message.channel.id}')`
    );
    message.channel.send("이 채팅방은 이제 노운이를 사용할 수 있어요.")
        return;
   }

   else if (message.content.startsWith(`!채널삭제`)) {
    connection.query(
      `delete from BotChannel where channelid = '${message.channel.id}'`
    );
    message.channel.send("이 채팅방은 이제 노운이를 사용할 수 없어요.")
        return;
   }


  else {
    message.channel.send("못알아 먹겠는걸");
  }
});

async function search(id,message){
  const now = new Date();
  const insertTime = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  let findAccountCode,resultSeason,season;
   
  try{
  findAccountCode = await axios( //account id
    {
      url:`https://api.pubg.com/shards/kakao/players?filter[playerNames]=${id}`,
      headers:{
        'Authorization': `Bearer ${apikey}`,
        'Accept': 'application/vnd.api+json'
      } 
    }
  )
  }
  catch(e){
  }
  if(!findAccountCode?.data?.data[0]?.id){
    const resultReply = new Discord.MessageEmbed()
    .setColor("#ff0022")
    .setTitle(`${id}의 전적 검색 결과가 없어용.`)
    .setFooter('PUBG 서버로부터 실시간 제공 받은 자료입니다.',"https://media.discordapp.net/attachments/551980252453142551/793809255547273256/known.jpg")
    message.reply('',resultReply)
   
connection.query(
  `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
  ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
  '${insertTime}','${message.content}','-','404_NOT FOUND_USER')`
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
        } 
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
      } 
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
      avgDill = String(avgDill).slice(0,5) 
result.rankSolo = `
${rankSolo.currentTier.tier} ${rankSolo.currentTier.subTier} : ${rankSolo.currentRankPoint}RP
최대티어: ${rankSolo.bestTier.tier}${rankSolo.bestTier.subTier} : ${rankSolo.bestRankPoint}RP
KDA: ${rankSolo.kda}
게임 수: ${rankSolo.roundsPlayed} 
평균 순위: ${rankSolo.avgRank}
킬/데스/어시: ${rankSolo.kills}/${rankSolo.deaths}/${rankSolo.assists}
평딜: ${avgDill}
`
}
else{
  result.rankSolo = `NO DATA`
}


if(rankSquad.currentTier.tier !== "NO DATA"){
  let avgDill = Number(rankSquad.damageDealt)/Number(rankSquad.roundsPlayed);
      avgDill = String(avgDill).slice(0,5) 
  result.rankSquad = `
  ${rankSquad.currentTier.tier} ${rankSquad.currentTier.subTier} : ${rankSquad.currentRankPoint}RP
  최대티어: ${rankSquad.bestTier.tier}${rankSquad.bestTier.subTier} : ${rankSquad.bestRankPoint}RP
  KDA: ${rankSquad.kda}
  게임 수: ${rankSquad.roundsPlayed} 
  평균 순위: ${rankSquad.avgRank}
  킬/데스/어시: ${rankSquad.kills}/${rankSquad.deaths}/${rankSquad.assists}
  평딜: ${avgDill}
  `
  }
  else{
    result.rankSquad = `NO DATA`
  }

  if(squad.kills !==''){
    let kda = Number(squad.kills)/Number(squad.losses);
    kda = String(kda).slice(0,3) 
    let winGamePercent = Number(squad.wins)/Number(squad.roundsPlayed)*100;
    winGamePercent = String(winGamePercent).slice(0,3) + '%'
    let avgDill = Number(squad.damageDealt)/Number(squad.roundsPlayed);
    avgDill = String(avgDill).slice(0,5) 
    if(kda == "NaN") kda = "-";
    if(winGamePercent == "NaN%") winGamePercent = "-";
    if(avgDill == "NaN") avgDill = "-"
    result.squad = `
    KDA: ${kda}
    승률: ${winGamePercent}
    평딜: ${avgDill}
    `
    }
    else{
      result.squad = `NO DATA`
    }
  if(duo.kills !==''){
      let kda = Number(duo.kills)/Number(duo.losses);
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
      승률: ${winGamePercent}
      평딜: ${avgDill}
      `
      }
      else{
        result.duo = `NO DATA`
      }

  if(solo.kills !==''){
        let kda = Number(solo.kills)/Number(solo.losses);
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
        승률: ${winGamePercent}
        평딜: ${avgDill}
        `
        }
        else{
          result.solo = `NO DATA`
        }

const resultReply = new Discord.MessageEmbed()
.setColor("#0ab1ff")
.setTitle(`${id} 전적 검색 결과에용`)
.addFields({name:`'                                                  '`,value:
`
.
`,inline:true},
{
  name:`'                                                  '`,value:
  `
  .
  `,inline:true
},
{
  name:`'                                                  '`,value:`
.
  `,inline:true
}
)
.addFields({name:`랭크 솔로`,value:`
${result.rankSolo}`,inline:true},
{name:`˙`,value:
`
'
`,inline:true},
{name:`랭크 스쿼드`,value:`
${result.rankSquad}`,inline:true})

.addFields({name:`솔로`,value:
`
${result.solo}
`,inline:true},
{
  name:`듀오`,value:`
${result.duo}`,inline:true
},
{
  name:`스쿼드`,value:`
${result.squad}
  `,inline:true
}
)
.setFooter('위 자료는 PUBG로부터 실시간 전송 받은 자료입니다.',"https://media.discordapp.net/attachments/551980252453142551/793809255547273256/known.jpg")
message.reply('',resultReply)
connection.query(
  `insert into BotLog (servername,channelname,usernick,time,usecommand,status) values 
  ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
  '${insertTime}','${message.content}','OK')`
);
}



 
client.login(config.discordapikey);