const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

module.exports = {
    type: 1,
    options: [],
    name: "stopevent",
    description: "Stop your event",
    disabled: false,
    run: async (client, config, interaction) => {
        const event = client.raidEvents.find(e => e.host === interaction.user.id);
        if (event?.started) {
            event.participents.forEach(id => {
                if (id != interaction.user.id) {
                    const user = client.users.cache.get(id);
                    if (user) {
                        const buttons = new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton()
                                .setCustomId(`deletemsg`)
                                .setLabel('Delete message')
                                .setStyle('DANGER'),
                        );

                        let embed = new Discord.MessageEmbed()
                            .setTitle("The event stopped!")
                            .setColor(config.embedColors.inform)
                            .setDescription("The host of the event has decided to stop the event.")
                            .setFooter('Made by Mohr#6969');
        
                        user.send({
                            embeds: [embed],
                            components: [buttons]
                        });
                    }
                }
            });

            const skippedCodes = event.skippedCodes.length > 0 ? `\nAlthough these codes were skipped: ${event.skippedCodes.join(", ")}` : "";

            let embed = new Discord.MessageEmbed()
                .setTitle('Stopped event!')
                .setColor(config.embedColors.error)
                .addField('Codes tested', `During your event, you went through: ${event.currentCodeCount-event.skippedCodes.length} codes.`)
                .addField('How far down the list did we get?', `You got to line: ${event.currentCodeCount}.${skippedCodes}`)
                .setDescription("Your event has been stopped.")
                .setFooter('Made by Mohr#6969');
        
            interaction.reply({embeds: [embed], ephemeral: true});

            event.stopEvent();
        } else if (event) {
            let embed = new Discord.MessageEmbed()
                .setTitle('Removed event!')
                .setColor(config.embedColors.error)
                .setDescription("The event hadn't started yet, therefore it was simply deleted.")
                .setFooter('Made by Mohr#6969');
        
            interaction.reply({embeds: [embed], ephemeral: true});
            
            event.stopEvent();
        } else {
            let embed = new Discord.MessageEmbed()
                .setTitle("You're not running any events!")
                .setColor(config.embedColors.error)
                .setDescription("You don't have any running. Use: `/createevent` to create one, for your party.")
                .setFooter('Made by Mohr#6969');

            interaction.reply({embeds: [embed], ephemeral: true});
        }
    }
}