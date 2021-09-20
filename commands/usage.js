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

        return msg.channel.send({embeds: [em]});
    }
}