개발환경
> Node 14.15.3
> MariaDB 10.x
> Linux Debian

주제
> 디스코드 배틀그라운드 전적 안내 봇

Function
> > 카카오배틀그라운드 전적 검색
> > 채팅방 사용권한 추가/삭제
> > 간편한 내 전적 검색을 위해 개별 함수 추가
Process
> > 디스코드API사용을 위한 토큰 발급.
> > 배틀그라운드 API사용을 위한 API키 발급.
> > > 배틀그라운드는 API 요청시 헤더에 다음과 같이 추가해야함.
> > >         'Authorization': `Bearer ${apikey}`,
> > >        'Accept': 'application/vnd.api+json'
> > 봇을 운영서버에서 돌려두고 message로 들어오는 Object 파싱.
> > 지정된 명령어와 일치하는지 봇은 아닌지 필터 후 함수 진입.
> > 게시판 남용 방지를 위해 방장이 해당 채널 사용 유무설정.

> 봇인지 체크 함수
```
if (message.author.bot) return;
  if (!message.content.startsWith("노운아!") && !message.content.startsWith("저장!") && !message.content.startsWith("내전적!") && !message.content.startsWith("도와줘!")&& !message.content.startsWith("!채널추가")&& !message.content.startsWith("!채널삭제")) return;
 
```

> 전적 검색 함수
```
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
```
