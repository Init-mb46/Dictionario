const {MessageEmbed} = require("discord.js");
const {pagify, listify, getWord} = require("../Functions");

module.exports = {
    data: {
        name: "example",
        description: "provides in-sentence-examples of the provided word",
        params: "1 (word)",
        aliases: ["e", "ex"]
    },
    async execute (msg, args){
        let config = require("../config.json");

        const embed = new MessageEmbed()
            .setTitle("Example")
            .setColor("DARK_BUT_NOT_BLACK")
            .setDescription("No examples found :(");

        if (args.length < 1) {
            embed.setDescription("Please enter a word to find an example of.");
            return msg.channel.send({embeds: [embed]});
        }

        word = args[0];

        let res = await getWord("example", word);
        let example = res.example || [];

        if (example.length >= 1) {
            //examples exist
            const em = await listify("Examples of "+ word, "", example, true);
            return msg.channel.send({embeds: [
                em.setColor("BLURPLE")
                    .setFooter(`Command : ${config.prefix}example`)
            ]});
        } else {
            return msg.channel.send({embeds: [embed]});
        }
    }
}