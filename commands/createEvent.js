const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

module.exports = {
    type: 1,
    options: [
        {
            name: "revealcode",
            description: "Should all users recieve the code, when it is found?",
            type: 5,
            required: true
        }
    ],
    name: "createevent",
    description: "Create a new rust code raid event!",
    disabled: false,
    run: async (client, config, interaction) => {
        if (client.raidEvents.find(event => event.host == interaction.user.id)) {
            let embed = new Discord.MessageEmbed()
                .setTitle("You're already running an event!")
                .setColor(config.embedColors.error)
                .setDescription("You can only host one event at a time. Use: `/stopevent` to stop hosting.")
                .setFooter('Made by Mohr#6969');

            interaction.reply({embeds: [embed], ephemeral: true});
        } else {
            const revealcode = interaction.options.getBoolean("revealcode");
            const event = new client.raidEvent(interaction.user.id, revealcode);
            let embed = new Discord.MessageEmbed()
                .setTitle('Successfully created event!')
                .setColor(config.embedColors.success)
                .addFields([
                    {name: 'Signup Code', value: `\`${event.code}\``, inline: true},
                    {name: 'Code reveal', value: `You have chosen for the code ${revealcode ? '' : '**NOT**'} to be revealed, after it's validated as real.`, inline: true},
                    {name: 'Warning!', value: 'Make sure all participents allow DMs, otherwise we can\'t reach out to them, when the event starts.', inline: false},
                ])
                .setDescription('Your event has been created. Everyone, with access to the invite code, can now join it. When you\'re ready, you can start the event by doing `/startevent`. \nGood luck code raiding!')
                .setFooter('Made by Mohr#6969');

            interaction.reply({embeds: [embed], ephemeral: true});
        }
    }
}