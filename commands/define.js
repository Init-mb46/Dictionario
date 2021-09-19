const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const url = "https://api.twinword.com/api/word/definition/latest/"
 
module.exports = {
    data: {
        name: "define",
        description: "provides the definition of a specific word",
        params: "1 (word)"
    },
    async execute(msg, args) {
        const embed = new MessageEmbed()
            .setTitle("Define")
            .setColor("DARK_BLUE")
            .setDescription("No definitions found :(");

        if (args.length < 1) {
            embed.setDescription("Please enter a word to define.");
            return msg.channel.send({embeds: [embed]});
        }

        

        console.log("defining in progress");
        
        return msg.channel.send({embeds:[embed]});
    }
}