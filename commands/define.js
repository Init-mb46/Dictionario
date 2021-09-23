const { MessageEmbed } = require("discord.js");
const {pagify, listify, getWord} = require("../Functions");
 
module.exports = {
    data: {
        name: "define",
        description: "provides the definition of a specific word",
        params: "1 (word)",
        aliases: ["d", "def", "definition"]
    },
    async execute(msg, args) {
        let config = require("../config.json");
        const embed = new MessageEmbed()
            .setTitle("Define")
            .setColor("DARK_BUT_NOT_BLACK")
            .setDescription("No definitions found :(");

        if (args.length < 1) {
            embed.setDescription("Please enter a word to define.");
            return msg.channel.send({embeds: [embed]});
        }
        let word = args[0].toLowerCase();

        let res  = await getWord("definition", word);
        let meaning = res.meaning || [];
        let available = {};

        if (meaning && Object.keys(meaning).length >= 1) {
            let nounMeanings = meaning.noun.replace(/[\n\s+]/g, " ").trim().split("(nou) ")
            nounMeanings.shift();
            let verbMeanings = meaning.verb.replace(/[\n\s+]/g, " ").trim().split("(vrb) ")
            verbMeanings.shift();
            let advMeanings = meaning.adverb.replace(/[\n\s+]/g, " ").trim().split("(adv)")
            advMeanings.shift();
            let adjMeanings = meaning.adjective.replace(/[\n\s+]/g, " ").trim().split("(adj) ")
            adjMeanings.shift();

            if (nounMeanings.length >= 1) available["nouns"] = nounMeanings;
            if (verbMeanings.length >= 1) available["verbs"] = verbMeanings;
            if (advMeanings.length >= 1) available["adverbs"] = advMeanings;
            if (adjMeanings.length >= 1) available["adjectives"] = adjMeanings;    
        }
        
        if (Object.keys(available).length > 1) {
            embed.setDescription("Enter which meaning you would like: ")
                .setFooter(`Command called by : ${msg.author.username}`);
            Object.keys(available).forEach(key => {
                embed.addField(`'${key}'`,`a list of ${key} associated with this word`);
            })
            await msg.reply({embeds: [embed]})
                .then((sentM) => {
                    msg.channel.awaitMessages({filter: m => m.author.id === msg.author.id, max: 1, time: 30000, errors : 'time'})
                        .then(collectedMsgs => {
                            let m = collectedMsgs.first();
                            if (available[m.content.trim().toLowerCase()]) {
                                m = m.content.trim().toLowerCase()
                                listify(`Definitions of ${word}`, m, available[m], true)
                                .then(em => {
                                    return msg.channel.send({embeds: [em
                                        .setFooter(`Command : ${config.prefix}define`)
                                        .setColor("BLURPLE")]});
                                });
                            } else {
                                //response invalid 
                                return msg.channel.send({embeds: [new MessageEmbed()
                                    .setTitle("Invalid definition term")
                                    .setDescription("Definitions under the term you specified do not exist")
                                    .setColor("DARK_BUT_NOT_BLACK")
                                    .setFooter(`Command : ${config.prefix}define`)]});
                            }
                        }).catch((c) => {
                            return msg.channel.send({embeds: [new MessageEmbed()
                                .setTitle("Timed out")
                                .setColor("DARK_BUT_NOT_BLACK")
                                .setDescription("You did not enter in time")
                                .setFooter(`Command called by: ${msg.author.username}`)]});
                        })
                })
        } else if (Object.keys(available).length == 1) {
            let m =Object.keys(available)[0];
            const em = await listify(`Definitions of ${word}`, m, available[m], true);

            return msg.channel.send({embeds: [em
                .setFooter(`Command : ${config.prefix}define`)
                .setColor("BLURPLE")]});
        } else {
            return msg.channel.send({embeds:[embed]});
        }
    }
}  