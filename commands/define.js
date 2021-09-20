const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const url = "https://api.twinword.com/api/word/definition/latest/?entry=";
const fs = require("fs");
 
async function getDefinition(word) {
    return fetch(url + word, {
        method: "GET",
	    headers: {
		    "Content-Type": "application/json",
            "Host": "api.twinword.com",
            "X-Twaip-Key": "cCvTrmPNr1dGXK2u6/jFzlCjKey/axFf2Ensxa5Al0AUzxg2E/9NaqVU/mwAsp7CmjdeGFHEhJP4KXVJomB0dw=="
        }
    }).then(res => {
        return res.json();
    }).then(data => {
        return data.meaning;
    })
}

module.exports = {
    data: {
        name: "define",
        description: "provides the definition of a specific word",
        params: "1 (word)"
    },
    async execute(msg, args) {
        let config = require("../config.json");
        const embed = new MessageEmbed()
            .setTitle("Define")
            .setColor("DARK_BLUE")
            .setDescription("No definitions found :(");

        if (args.length < 1) {
            embed.setDescription("Please enter a word to define.");
            return msg.channel.send({embeds: [embed]});
        }
        let word = args[0].toLowerCase();

        let meanings  = await getDefinition(word);
        config.usage ++;
        fs.writeFile("config.json", JSON.stringify(config,null,2), (e) => {
            if (e) {
                throw e;
            }
        })

        let available = {};

        if (meanings && Object.keys(meanings).length >= 1) {
            let nounMeanings = meanings.noun.replace(/[\n\s+]/g, " ").trim().split("(nou) ")
            nounMeanings.shift();
            let verbMeanings = meanings.verb.replace(/[\n\s+]/g, " ").trim().split("(vrb) ")
            verbMeanings.shift();
            let advMeanings = meanings.adverb.replace(/[\n\s+]/g, " ").trim().split("(adv)")
            advMeanings.shift();
            let adjMeanings = meanings.adjective.replace(/[\n\s+]/g, " ").trim().split("(adj) ")
            adjMeanings.shift();

            if (nounMeanings.length >= 1) available["nouns"] = nounMeanings;
            if (verbMeanings.length >= 1) available["verbs"] = verbMeanings;
            if (advMeanings.length >= 1) available["adverbs"] = advMeanings;
            if (adjMeanings.length >= 1) available["adjectives"] = adjMeanings;    
        }
        
        if (Object.keys(available).length >= 1) {
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
                                let embed2 = new MessageEmbed()
                                    .setDescription(`${m.content}`)
                                    .setTitle(`Definition of ${word.toLowerCase()}`)
                                    .setColor("BLURPLE")
                                    .setFooter(`Command : ${config.prefix}define`);
                                
                                available[m.content.trim().toLowerCase()].forEach((v, index) => {
                                    embed2.addField(`${index + 1}. ${v}`, "—");
                                })
                                
                                return msg.reply({embeds: [embed2]});
                            } else {
                                //response invalid 
                                return sentM.reply({embeds: [new MessageEmbed()
                                    .setTitle("Invalid definition term")
                                    .setDescription("Definitions under the term you specified do not exist")
                                    .setColor("DARK_BUT_NOT_BLACK")
                                    .setFooter(`Command : ${config.prefix}define`)]});
                            }
                        }).catch((c) => {
                            return sentM.reply({embeds: [new MessageEmbed()
                                .setTitle("Timed out")
                                .setColor("DARK_BUT_NOT_BLACK")
                                .setDescription("You did not enter in time")
                                .setFooter(`Command called by: ${msg.author.username}`)]});
                        })
                })
        } else {
            return msg.channel.send({embeds:[embed]});
        }
    }
}  