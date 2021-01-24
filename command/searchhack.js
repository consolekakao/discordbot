async function searchHack(message,insertTime){
    const Discord = require("discord.js");
const  mysql = require("mysql");
const client = new Discord.Client();
let apikey = require("../config.json")
const config = require("../config.json");
const { default: axios } = require("axios");
let connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });


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
             await connection.query(
                 `insert into BotLog (servername,channelname,usernick,time,usecommand,status,errormessage) values 
                 ('${message.channel.guild.name}','${message.channel.name}','${message.author.username +' #' +message.author.discriminator}',
                 '${insertTime}','${message.content}','OK','')`
               );
              await message.author.send(`검색 결과는 다음과 같아요!\n의심유저 [신고횟수]`);
              await message.author.send(`:${guessdata}`);
              await message.author.send(`핵쟁이 [신고횟수]`)
              await message.author.send(`:${hackdata}`)
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



}

module.exports = searchHack;