const Discord = require("discord.js");
const  mysql = require("mysql");
const config = require("./config.json");
const searchInfo = require("./command/searchinfo.js");
const useKnown = require("./command/useknown.js");
const unuseKnown = require("./command/unuseknown.js");
const saveNick = require("./command/savenick.js");
const myInfo = require("./command/myinfo.js");
const command = require("./command/command.js");
const splitTeam = require("./command/splitteam.js");
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

client.once("ready", () => {
  let now = new Date();
  console.log(`---BOT READY! ${now.getFullYear()}-${Number(now.getMonth())+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} --- `);
 client.user.setActivity(`사용법은 !help `);
});

try{
    client.on("message", async message => {
  let regax = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
   let regax2 = /[\{\}\[\]\/?.,;:|\)*~`^\-_+<>@\#$%&\\\=\(\'\"]/gi;
   message.channel.guild.name = await message.channel.guild.name.replace(regax,"").replace(regax2,"");
   message.content = await message.content.replace(regax,"").replace(regax2,"");
   message.author.username = await message.author.username.replace(regax,"").replace(regax2,"");
   message.channel.name =  await message.channel.name.replace(regax,"").replace(regax2,"");




  if (message.author.bot) return;
 const now = new Date();
  const insertTime = `${now.getFullYear()}-${Number(now.getMonth())+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
 try {
     connection.query(
         `insert into BotChat (server,channel,name,contents,time) values ("${message.channel.guild.name}","${message.channel.name.replace(/[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/g,"")}","${message.author.username.replace(/[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/g,"")}","${message.content.replace(/[^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/g,"")}","${insertTime}");`
     );
 }
 catch (e){
     client.guilds.cache.get("551980252453142549").channels.cache.get("802281466952024114").send(`다음과같은 오류가 있었어요.\`${String(e).substring}\``);
 }
  console.log(`${insertTime}:${message.channel.guild.name}:${message.channel.name}:${message.author.id}:${message.content}`)
  console.log(`user:${message.author.username} server:${message.channel.guild.name} channel:${message.channel.name}`);
  console.log(`channelid:${message.channel.id} request: ${message.content} time:${insertTime}`);
  console.log(' ');

        if (message.content.startsWith(`!전적`)) searchInfo(message);
   else if (message.content.startsWith(`!채널추가`) && (message.channel.guild.ownerID == message.author.id || message.author.id == admin)) useKnown(message);
   else if (message.content.startsWith(`!채널삭제`) && (message.channel.guild.ownerID == message.author.id || message.author.id == admin)) unuseKnown(message);
   else if (message.content.startsWith(`!저장`)) saveNick(message,insertTime);
   else if (message.content.startsWith(`!내전적`)) myInfo(message,insertTime);
   else if(message.content.startsWith(`!help`) || message.content.includes == `help`) command(message,insertTime);
   else if(message.content.startsWith(`!팀배정`)) splitTeam(message,insertTime);
   else if(message.content.startsWith(`!에러로그`) && message.author.id == admin) sendLog(message,1,insertTime);
   else if(message.content.startsWith(`!봇로그`) && message.author.id == admin) sendLog(message,2,insertTime);
   else if(message.content.includes(`전적`) || message.content.includes(`노운`)){
            connection.query(
                `SELECT * FROM BotChannel where channelid = "${message.channel.id}"`,
                async function (err, rows) {
                    try {
                        if (err) throw err;
                        if(rows[0] ) message.reply("명령어가 정확하지 않아요. \r\n 혹시 `!전적 <player>` 또는 `!내전적` 명령어를 찾으시나요?\r\n명령어를 모르겠다면 `!help`를 입력하세요.");
                        else return;

                    } catch (error) {
                        console.error(error);
                    }
                }
            );
        }


return;
}
);

}
catch(errlog){
  console.log(errlog);
  //client.guilds.cache.get("551980252453142549").channels.cache.get("802281466952024114").send(`다음과같은 오류가 있었어요.\`${String(e).substring}\``);
}





client.login(config.discordapikey);


