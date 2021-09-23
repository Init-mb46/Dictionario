const {MessageEmbed, Message} = require("discord.js");

//provides the usage of the bot
module.exports = {
    data: {
        name: "usage",
        description: "Provides the current number of api calls used over the maximum allowed api calls.",
        aliases: ["u"]
    },
    async execute(msg, args) {
        const {usage, usage_limit} = require("../config.json");

        const em = new MessageEmbed()
            .setTitle("TwinWord API Usage")
            .setDescription(`${usage} / ${usage_limit} free API calls used.`);

        if (usage_limit - usage < 150) {
            em.addField("USE WITH CAUTION __ APPROACHING API FREE LIMIT (OR PAST LIMIT)", "\u200B");
        }

        return msg.channel.send({embeds: [em]});
    }
}