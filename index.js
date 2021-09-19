const Discord = require("discord.js");
const fs = require("fs");
const Token = fs.existsSync("./token.json") ? require("./token.json") : undefined;
const Config = require("./config.json");

const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

for(const f of commandFiles) {
    const cmd = require(`./commands/${f}`);
    client.commands.set(cmd.data.name, cmd);
    console.log(`${Config.prefix}${cmd.data.name} loaded. Description: ${cmd.data.description}`);
}

async function parseMessage(msg) {
    let args = msg.content.replace(/\s+/g,' ').trim().split(" ");
    let cmdWPref = args.shift().toLowerCase();
    return { args: args, cmdWPref: cmdWPref };
}

async function makeEmbed(title, desc) {
    let embed = new Discord.MessageEmbed()
    return embed.setTitle(title).setDescription(desc);
}

client.on("ready", async () =>{
    console.log(`Bot logged in as ${client.user.username} on ${client.guilds.cache.size} servers.`);
})

client.on("messageCreate", async msg => {
    if (msg.author.bot) return;

    let pref = Config.prefix;
    console.log()
    let {args, cmdWPref} = await parseMessage(msg);

    if (!cmdWPref.startsWith(pref)) return;
    let cmd = cmdWPref.slice(pref.length);
    let actualCommand = client.commands.get(cmd);

    try {
        if (!actualCommand) {
            await msg.reply({embeds: [await makeEmbed("Command not found", `Type ${pref}help for a list of commands.`)]});
            return;
        }

        await actualCommand.execute(msg,args);
    } catch (e) {
        console.error(e);
    }
})


let t = Token ? Token.Token : process.env.token;
client.login(t);

async function checkOnline() {
    console.log("online: " + new Date());
}
const CheckTO = setInterval(() => checkOnline(), 300000)