const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

module.exports = {
    eventName: "interactionCreate",
    disabled: false,
    run: async (client, config, interaction) => {
        if (interaction.isCommand()) {
            client.commands.get(interaction.commandName).run(client, config, interaction)
        } else if (interaction.isButton()) {
            if (interaction.customId == 'deletemsg') {
                const message = interaction.message.edit ? interaction.message : await (await client.channels.fetch(interaction.channelId)).messages.fetch(interaction.message.id);
                message.delete();
            } else {
                const regex = /(?<code>.{5})_(?<action>.*)(?=_)_(?<data>.*)/;
                const match = regex.exec(interaction.customId).groups;
                const {code, action} = match;
    
                const event = client.raidEvents.get(code);
                if (event) {
                    if (action == "skip" || action == "new") {
                        const codeToSkip = event.participentsCurrentCode.get(interaction.user.id);
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Keep going!")
                            .setColor(config.embedColors.inform)
                            .addField('Code', `Your next code is: ${event.getNewCode(interaction.user.id)}.`, true)
                            .addField('Tested codes', `${event.currentCodeCount}`, true)
                            .setFooter('Made by Mohr#6969');
    
                        if (event.currentCodeCount > 10) {
                            embed.addField('Average time used per code', `Every ${global.roundFunction(event.calculateAvgCodeRate()/1000)} seconds. (Last 25 codes.)`)
                            embed.addField('Chance of being done', `25%: ${ms(global.roundFunction((1928-event.currentCodeCount) * event.calculateAvgCodeRate()))}\n50%: ${ms(global.roundFunction((4294-event.currentCodeCount) * event.calculateAvgCodeRate()))}\n75%: ${ms(global.roundFunction((6933-event.currentCodeCount) * event.calculateAvgCodeRate()))}\n95%: ${ms(global.roundFunction((9298-event.currentCodeCount) * event.calculateAvgCodeRate()))}`)
                        }

                        if (action == "skip") {
                            embed.setDescription(`Skipped code: ${codeToSkip}. You're currently doing good progress!`)
                            event.skipCode(codeToSkip);
                        } else if (action == "new") {
                            embed.setDescription("You're currently doing good progress!")   
                        }

                        interaction.update({embeds: [embed]});
                    } else if (action == "validate") {
                        const codeToValidate = event.participentsCurrentCode.get(interaction.user.id);
                        if (interaction.user.id == event.host) {
                            event.setWorkingCode(codeToValidate);
                            
                            const buttons = new Discord.MessageActionRow().addComponents(
                                new Discord.MessageButton()
                                    .setCustomId(`deletemsg`)
                                    .setLabel('Delete message')
                                    .setStyle('DANGER'),
                            );
                    
                            let embed = new Discord.MessageEmbed()
                                .setTitle("The code was found!")
                                .setColor(config.embedColors.success)
                                .setDescription("The event is now over.")
                                .addField('Code', `The code was: ${match.data}`)
                                .setFooter('Made by Mohr#6969');
    
                            interaction.update({embeds: [embed], components: [buttons]});
                        } else {
                            client.users.fetch(event.host).then(host => {
    
                                const buttons = new Discord.MessageActionRow().addComponents(
                                    new Discord.MessageButton()
                                        .setCustomId(`${event.code}_codevalid_${codeToValidate}`)
                                        .setLabel('Valid')
                                        .setStyle('SUCCESS'),
    
                                    new Discord.MessageButton()
                                        .setCustomId(`${event.code}_codeinvalid_${codeToValidate}`)
                                        .setLabel('Invalid')
                                        .setStyle('DANGER'),
                                );
            
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`${interaction.user.tag} (${interaction.user.id}) wants their code validated!`)
                                    .setColor(config.embedColors.success)
                                    .addField('Code', codeToValidate)
                                    .setDescription("Please test this code, and validate it.")
                                    .setFooter('Made by Mohr#6969');
            
                                host.send({embeds: [embed], components: [buttons]});
                            })

                            let embed = new Discord.MessageEmbed()
                                .setTitle("You're code is being validated!")
                                .setColor(config.embedColors.inform)
                                .addField('Code', `Currently validating: ${event.participentsCurrentCode.get(interaction.user.id)}`)
                                .setDescription("You're currently doing good progress!")
                                .setFooter('Made by Mohr#6969');

                            interaction.update({embeds: [embed]});
                        }
                    } else if (action == "codevalid") {
                        event.setWorkingCode(match.data);
                            
                        const buttons = new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton()
                                .setCustomId(`deletemsg`)
                                .setLabel('Delete message')
                                .setStyle('DANGER'),
                        );
                
                        let embed = new Discord.MessageEmbed()
                            .setTitle("The code was found!")
                            .setColor(config.embedColors.success)
                            .setDescription("The event is now over.")
                            .addField('Code', `The code was: ${match.data}`)
                            .setFooter('Made by Mohr#6969');

                        interaction.update({embeds: [embed], components: [buttons]});
                    } else if (action == "codeinvalid") {
                        client.channels.fetch(interaction.channelId).then(channel => channel.messages.fetch(interaction.message.id).then(m => m.delete()));
                    } else if (action == "leave") {
                        event.leaveEvent(interaction.user.id);
                        const buttons = new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton()
                                .setCustomId(`deletemsg`)
                                .setLabel('Delete message')
                                .setStyle('DANGER'),
                        );
    
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Left the event!")
                            .setColor(config.embedColors.success)
                            .setDescription("You have now left the event. You can no longer participate in it.")
                            .setFooter('Made by Mohr#6969');
    
                        interaction.update({embeds: [embed], components: [buttons]});
                    } else {
                        console.log(interaction);
                        console.log(`Unknown action: ${action}`);
                    }
                } else {
                    interaction.reply({content: "That event isn't running. Sorry!", ephemeral: true});
                    client.channels.fetch(interaction.channelId).then(channel => channel.messages.fetch(interaction.message.id).then(m => m.delete()));
                }
            }
        }
    }
}