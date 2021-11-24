const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

module.exports = {
    type: 1,
    options: [
        {
            name: "code",
            description: "The code for the event",
            type: 3,
            required: true
        }
    ],
    name: "signup",
    description: "Signup for an event",
    disabled: false,
    run: async (client, config, interaction) => {
        const event = client.raidEvents.get(interaction.options.getString("code"));
        if (event) {
            if (event.started) {
                let embed = new Discord.MessageEmbed()
                    .setTitle('Event has already started!')
                    .setColor(config.embedColors.error)
                    .setDescription("The event you're trying to signup for, has unfortunately already started. Make sure to be there, before it starts next time.")
                    .setFooter('Made by Mohr#6969');
        
                interaction.reply({embeds: [embed], ephemeral: true});
            } else {
                if (event.participate(interaction.user.id)) {
                    let embed = new Discord.MessageEmbed()
                        .setTitle('Successfully joined event!')
                        .setColor(config.embedColors.success)
                        .setDescription('Thank you for signing up to the event. Make sure to allow DMs, otherwise we can\'t reach out to you.')
                        .setFooter('Made by Mohr#6969');
        
                    interaction.reply({embeds: [embed], ephemeral: true});
                } else {
                    let embed = new Discord.MessageEmbed()
                        .setTitle('Already joined event!')
                        .setColor(config.embedColors.inform)
                        .setDescription("You're already signed up for this event. Please remain patient, until the event starts.")
                        .setFooter('Made by Mohr#6969');
        
                    interaction.reply({embeds: [embed], ephemeral: true});
                }
            }
        } else {
            let embed = new Discord.MessageEmbed()
                .setTitle("Couldn't find event!")
                .setColor(config.embedColors.error)
                .setDescription("There seems to be no event with that code. Make sure you typed the code correctly.")
                .setFooter('Made by Mohr#6969');
        
            interaction.reply({embeds: [embed], ephemeral: true});
        }
    }
}