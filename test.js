const Discord = require("discord.js");
const  mysql = require("mysql");
const config = require("./config.json");
const searchInfo = require("./command/searchinfo.js");
const useKnown = require("./command/useknown.js");
const unuseKnown = require("./command/unuseknown.js");
const saveNick = require("./command/savenick.js");
const myInfo = require("./command/myinfo.js");
const command = require("./command/command.js");
const searchHack = require("./command/searchhack.js");
const addHack = require("./command/addhack.js");
const splitTeam = require("./command/splitteam.js");
const connect = require("./command/connect.js");
const disconnect = require("./command/disconnect.js");
const sendLog = require("./command/sendlog.js");
const client = new Discord.Client();
let connection = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
});
const admin = "526415286358769664";
const customServer = "551980252453142549"; 

client.once("ready", () => {
  let now = new Date();
  console.log(`■□■□■□■  BOT READY! ${now.getFullYear()}-${Number(now.getMonth())+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ■□■□■□■□■□■□ `);
 client.user.setActivity(`사용법 > help! `);
});

try{



client.on("message", async message => { 
  if (message.author.bot) return;
 const now = new Date();
  const insertTime = `${now.getFullYear()}-${Number(now.getMonth())+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  connection.query(
    `insert into BotChat (server,channel,name,contents,time) values ('${message.channel.guild.name}','${message.channel.name}','${message.author.username}','${message.content}','${insertTime}')`
  );
  console.log(`${insertTime}:${message.channel.guild.name}:${message.channel.name}:${message.author.username}:${message.content}`)

  console.log(`user:${message.author.id} server:${message.channel.guild.name} channel:${message.channel.name}`);
  console.log(`channelid:${message.channel.id} request: ${message.content} time:${insertTime}`);
  console.log(' ');

        if (message.content.startsWith(`노운아!`)) searchInfo(message);
   else if (message.content.startsWith(`!채널추가`) && (message.channel.guild.ownerID == message.author.id || message.author.id == admin)) useKnown(message);
   else if (message.content.startsWith(`!채널삭제`) && (message.channel.guild.ownerID == message.author.id || message.author.id == admin)) unuseKnown(message);
   else if (message.content.startsWith(`저장!`)) saveNick(message,insertTime);
   else if (message.content.startsWith(`내전적!`)) myInfo(message,insertTime);
   else if(message.content == `도와줘!` || message.content == `help!`) command(message,insertTime);
   else if(message.content.startsWith(`핵쟁이조회!`)) searchHack(message,insertTime);
   else if(message.content.startsWith(`핵쟁이추가!`)) addHack(message,insertTime);
   else if(message.content.startsWith("팀배정!")) splitTeam(message,insertTime);
   else if(message.content.startsWith(`!커넥트`) && (message.channel.guild.ownerID == message.author.id || message.author.id == admin)) connect(message,insertTime);
   else if(message.content.startsWith(`!디스커넥트`) && (message.channel.guild.ownerID == message.author.id || message.author.id == admin)) disconnect(message,insertTime);
   else if(message.content.startsWith(`!서버정보`) && (message.channel.guild.ownerID == message.author.id || message.author.id == admin)) message.channel.send(`\`서버ID  ${message.guild.id}\` \n\`채널ID  ${message.channel.id}\``)
   else if(message.content.startsWith(`!에러로그`) && message.author.id == admin) sendLog(message,1,insertTime);
   else if(message.content.startsWith(`!봇로그`) && message.author.id == admin) sendLog(message,2,insertTime);
   else if(message.content.startsWith(`!경기시작`) && message.author.id == admin || message.author.id == "481052468277411850" || message.author.id == "444862001777475594" && message.guild.id == customServer){
    const list = client.guilds.cache.get(message.guild.id)
    const members =  list.members.cache.map(member => {
     member.id; 
      if(member.roles.cache.has('804423345139482666')){
        member.roles.remove('804423345139482666'); 
        member.roles.add('804423289665224774');
        console.log("complete") 
      }
   });
   }

   else if(message.content.startsWith(`!경기종료`)&& message.author.id == admin || message.author.id == "481052468277411850" || message.author.id == "444862001777475594" && message.guild.id == customServer){
    const list = client.guilds.cache.get(message.guild.id)
   const members =  list.members.cache.map(member => {
     member.id; 
      if(member.roles.cache.has('804423289665224774')){
        member.roles.remove('804423289665224774'); member.roles.add('804423345139482666');console.log("complete")
        if (member.roles.cache.has('804423289665224774') || member.roles.cache.has('804423345139482666')) member.voice.kick()
      }
   });
   }



   else {
    connection.query(
      `SELECT * FROM BotConnection where requestserverid = "${message.guild.id}" and requestchannelid = "${message.channel.id}"`,
     async function (err, rows) {
          if (err) throw err;
          if(rows[0] !== undefined ) saveNickCheck(); 
      })
    
      function saveNickCheck(){
        connection.query(
          `SELECT savename FROM BotSaveNick where userid = "${message.author.id}"`,
         async function (err, rows) {
              if (err) throw err;
              if(rows[0] !== undefined ) sendMessage(decodeURI(rows[0].savename)); 
              else{message.channel.send("`저장! <아이디>`로 아이디를 먼저 등록해주세요."); return;}
          })
      }
    
      function sendMessage(nick){
        if(message.content.startsWith("!help") || message.content.startsWith("!커넥트") || message.content.startsWith("!디스커넥트")) 
        {
            client.guilds.cache.get('551980252453142549').channels.cache.get('802281466952024114').send(`[명령어입력]\n일시: ${now.getMonth()+1}월 ${now.getDate()}일${now.getHours()}시 ${now.getMinutes()}분 \n의심서버: ${message.guild.name} \n의심 유저:${message.author.username} \n메시지내용:${message.content}\n처리결과:미전송`)
            return;
        }
      if(message.content.includes("//") || message.content.includes("http") || message.content.includes("www.") || message.content.includes(".com")) 
      {
          message.channel.send("`주소 공유가 감지되었어요. \n원만한 클랜 관계를 위해 해당 메시지는 전송하지 않았어요.`")
          client.guilds.cache.get('551980252453142549').channels.cache.get('802281466952024114').send(`[주소 공유 의심]\n일시: ${now.getMonth()+1}월 ${now.getDate()}일${now.getHours()}시 ${now.getMinutes()}분 \n의심서버: ${message.guild.name} \n의심 유저:${message.author.username} \n메시지내용:${message.content}\n처리결과:미전송`)
          return;
      }
    
      else if(message.content.includes(message.author.discriminator)) 
      {
          message.channel.send("`해시태그가 감지되었어요. \n원만한 클랜 관계를 위해 해당 메시지는 전송하지 않았어요.`")
          client.guilds.cache.get('551980252453142549').channels.cache.get('802281466952024114').send(`[디스코드 계정 공유 의심]\n일시: ${now.getMonth()+1}월 ${now.getDate()}일${now.getHours()}시 ${now.getMinutes()}분 \n의심서버: ${message.guild.name} \n의심 유저:${message.author.username} \n메시지내용:${message.content}\n처리결과:미전송`)
          return;
      }
    
      else {
      connection.query(
          `SELECT * FROM BotConnection where requestserverid = "${message.guild.id}" and requestchannelid = "${message.channel.id}"`,
         async function (err, rows) {
            try {
              if (err) throw err;
              if(rows[0]) {
                 
                 connection.query(

                  `select * from BotConnection where requestserverid = "${message.guild.id}"`,
                  async function (err, rows) {
                      try {
                        if (err) throw err;
                        if(rows) {
                            let allowServerList = [];
                                for(let i=0;i<rows.length;i++)
                                  {
                                  let allowData = {};
                                  allowData.serverid = decodeURI(rows[i].responseserverid);
                                  allowData.channelid = decodeURI(rows[i].responsechannelid);
                                  allowServerList.push(allowData);
                                  }
                            message.guild.name.length > 10 ? message.guild.name = message.guild.name.slice(0,10):message.guild.name = message.guild.name.padEnd(10,' ');
                            for(let i=0;i<allowServerList.length;i++)
                            client.guilds.cache.get(allowServerList[i].serverid).channels.cache.get(allowServerList[i].channelid).send(`${message.guild.name}   **${nick}** ${message.content}`)
                            
                            }
                      }
                      catch(e){client.guilds.cache.get("551980252453142549").channels.cache.get("802281466952024114").send(`다음과같은 오류가 있었어요.\`${String(e).substring}\``)}
                      }
                );
    
              }
              else return;
              
            } catch (error) {
              //console.error(error);
              client.guilds.cache.get("551980252453142549").channels.cache.get("802281466952024114").send(`다음과같은 오류가 있었어요.\`${String(e).substring}\``)
            }
          }
        );
    
    
    
      }
      }
  
   }

   
    
  



return;
}
);

}
catch(errlog){
  console.log(errlog);
  client.guilds.cache.get("551980252453142549").channels.cache.get("802281466952024114").send(`다음과같은 오류가 있었어요.\`${String(e).substring}\``)
}





client.login(config.discordapikey);


