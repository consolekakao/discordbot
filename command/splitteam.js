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
function teamSplit(message,insertTime){
    try{
  
  
    const args = String(message.content).split(/ +/);
    if(isNaN(Number(args[1])) || Number(args[1]) == 0)
    {
      message.channel.send("사용법이 이상해요. \n팀배정! <팀별인원수> 멤버A 멤버B 멤버C\nex) 팀배정! 3 팀원A 팀원B 팀원C 팀원D")
      connection.query(
        `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
        ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
        '${insertTime}','${message.content}','-','SYNTAX ERR')`
      );
      return;
    }
    let data = [];
    for(let i=2;i<args.length;i++)
    {
      data[i-2] = args[i]
    }
    data = shuffle(data)
    let result = [];
    let team = [];
    let count = Number(args[1]);;
    while(true)
    {
      if(team.length < Number(args[1]))
      {
        team.push(data.pop())
        
      }
      else if(team.length == Number(args[1]))
      {
        result.push(team);
        team = [];
      }
      
      
      if(data.length == 0 || data.length == "0")
      {
        result.push(team);
        team = [];
        break;
      }
      
  
    }
  
    let arr = "";
  let re = new Discord.MessageEmbed()
  .setColor("#ff0022")
  .setTitle(`총 ${result.length}팀이 나왔어요.`)
  for(let i = 0; i<result.length;i++)
  {
  arr = "";
  for(let j=0;j<result[i].length;j++)
  {
    arr += result[i][j] + "\n";
  }
  re.addFields(
    {name:`${i+1}팀`,value:`${arr}`},
    {name:`\u200b`,value:`\u200b`}
  )
  }
  message.reply('',re)
  connection.query(
    `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
    ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
    '${insertTime}','${message.content}','OK','')`
  );
  }
  catch(e){console.log(e)}

  function shuffle(a) {  var j, x, i; for (i = a.length; i; i -= 1) { j = Math.floor(Math.random() * i); x = a[i - 1]; a[i - 1] = a[j]; a[j] = x; } return a;}


}

module.exports = teamSplit;