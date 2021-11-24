const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    eventName: "ready",
    disabled: false,
    run: async (client, config) => {
        console.log(`${client.user.tag} booted at: ${client.readyAt.toLocaleString()}`);
        client.application.commands.set(client.rawcommands);
    }
}