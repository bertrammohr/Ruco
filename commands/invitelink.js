const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

module.exports = {
    type: 1,
    options: [],
    name: "invitelink",
    description: "Invite link for the bot",
    disabled: false,
    run: async (client, config, interaction) => {
        interaction.reply({content: `The official invite link for the bot is: https://discord.com/api/oauth2/authorize?client_id=911984362420060220&permissions=2048&scope=bot%20applications.commands`, ephemeral: true})
    }
}