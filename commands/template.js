const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

module.exports = {
    type: 1,
    options: [
        {
            name: "argument",
            description: "user",
            type: 3
        }
    ],
    name: "template",
    description: "description",
    disabled: false,
    run: async (client, config, interaction) => {
           
    }
}