const {MessageEmbed} = require("discord.js");
const {pagify, listify, getWord} = require("../Functions");

module.exports = {
    data: {
        name: "related",
        description: "provides words that are related to the provided word",
        params: "1 (word)",
        aliases: ["r", "relation", "relate"]
    },
    async execute (msg, args){
        let config = require("../config.json");

        const embed = new MessageEmbed()
            .setTitle("Related")
            .setColor("DARK_BUT_NOT_BLACK")
            .setDescription("No related words found :(");

        if (args.length < 1) {
            embed.setDescription("Please enter a word to find a related word of.");
            return msg.channel.send({embeds: [embed]});
        }

        word = args[0];

        let res = await getWord("association", word);
        let assoc = res.assoc_word_ex || [];

        if (assoc.length >= 1) {
            //examples exist
            const em = await listify("Related words of " + word, "", assoc, true);
            return msg.channel.send({embeds: [
                em.setColor("BLURPLE")
                    .setFooter(`Command : ${config.prefix}related`)
            ]});
        } else {
            return msg.channel.send({embeds: [embed]});
        }
    }
}