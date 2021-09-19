const Discord = require("discord.js");
const fs = require("fs");
const Token = fs.existsSync("./token.json") ? require("./token.json") : undefined;

const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});

client.on("ready", () =>{
    console.log(`Bot logged in as ${client.user.username} on ${client.guilds.cache.size} servers.`);
})

let t = Token ? Token.Token : process.env.token;
client.login(t);