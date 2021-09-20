const {MessageEmbed, Message} = require("discord.js");

module.exports = {
    data: {
        name: "usage",
        description: "Provides the current number of api calls used over the maximum allowed api calls."
    },
    async execute(msg, args) {
        const {usage, usage_limit} = require("../config.json");

        const em = new MessageEmbed()
            .setTitle("TwinWord API Usage")
            .setDescription(`${usage} / ${usage_limit} free API calls used.`);

        if (usage_limit - usage < 150) {
            em.addField("USE WITH CAUTION __ APPROACHING API FREE LIMIT (OR PAST LIMIT)", "\u200B");
        }

        if (usage % 25 == 0) {
            console.log(`${usage} api calls used`);
        }

        return msg.channel.send({embeds: [em]});
    }
}