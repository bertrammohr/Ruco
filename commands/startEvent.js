const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

module.exports = {
    type: 1,
    options: [],
    name: "startevent",
    description: "Start an event, you created.",
    disabled: false,
    run: async (client, config, interaction) => {
        const event = client.raidEvents.find(e => e.host === interaction.user.id);
        if (event) {
            event.startEvent();

            let embed = new Discord.MessageEmbed()
                .setTitle('Successfully started event!')
                .setColor(config.embedColors.success)
                .addField('Event participents', `${event.participents.size} ${event.participents.size > 1 ? 'people' : 'person'} joined.`)
                .setDescription("Your event has started. All members are now receiving messages in their DMs. When a member finds the code, you will receive it to validate it.")
                .setFooter('Made by Mohr#6969');

            interaction.reply({embeds: [embed], ephemeral: true});            
        } else {
            let embed = new Discord.MessageEmbed()
                .setTitle("You're not running any events!")
                .setColor(config.embedColors.error)
                .setDescription("You cannot start an event, as you don't have any running. Use: `/createevent` to create one, for your party.")
                .setFooter('Made by Mohr#6969');

            interaction.reply({embeds: [embed], ephemeral: true});
        }
    }
}