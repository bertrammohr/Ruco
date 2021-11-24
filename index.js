const Discord = require("discord.js");
const {Client, Intents, Collection} = Discord;
const client = new Client({
    intents: []
})
const fs = require("fs");
const config = require('./config.json');

const codes = require('./codes.js');

global.roundFunction = function(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}

client.raidEvents = new Collection();
client.raidEvent = class {
    constructor (host, revealCode, customCode) {
        // Base
        this.code = customCode ?? (Math.random() + 1).toString(36).substring(2, 7).toUpperCase();
        this.host = host;
        this.revealCode = revealCode;
        this.started = false;
        this.workingcode = null;
        
        // Participents
        this.participents = new Set();
        this.participents.add(host);
        this.participentsCurrentCode = new Map();

        // Codes
        this.skippedCodes = [];
        this.currentCodeCount = 0;
        this.codeTimestamps = [];

        client.raidEvents.set(this.code, this);

        client.channels.fetch("912807833634996245").then(channel => {
            channel.send(`Created event: ${this.code}.`);
        })
    }

    startEvent() {

        client.channels.fetch("912809843809718303").then(channel => {
            channel.send(`Event: ${this.code} started with ${this.participents.size} participents.`);
        })

        this.started = true;
        this.participents.forEach(id => {
            const user = client.users.cache.get(id);
            if (user) {
                const buttons = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`${this.code}_skip_`)
                        .setLabel('Skip code')
                        .setStyle('DANGER'),

                    new Discord.MessageButton()
                        .setCustomId(`${this.code}_new_`)
                        .setLabel('Get next code')
                        .setStyle('PRIMARY'),

                    new Discord.MessageButton()
                        .setCustomId(`${this.code}_validate_`)
                        .setLabel('Mark code as working')
                        .setStyle('SUCCESS')
                );

                if (id != this.host) {
                    buttons.addComponents(
                        new Discord.MessageButton()
                        .setCustomId(`${this.code}_leave_`)
                        .setLabel('Leave Raid')
                        .setStyle('SECONDARY'),
                    )
                }
                
                const generatedCode = this.getNewCode(id);
                let embed = new Discord.MessageEmbed()
                    .setTitle("The event has started!")
                    .setColor(config.embedColors.inform)
                    .addField('Code', `Your first code is: ${generatedCode}.`)
                    .setDescription("A code raid event you're participating in has started. Use the buttons below, to get started!")
                    .setFooter('Made by Mohr#6969');

                user.send({
                    components: [buttons],
                    embeds: [embed],
                }).catch(err => {
                    this.skipCode(generatedCode);
                })
            }
        });
    }
    
    stopEvent() {
        client.channels.fetch("912807857160859728").then(channel => {
            channel.send(`Event: ${this.code} stopped.`);
        })

        client.raidEvents.delete(this.code);
    }

    createTimestamp() {
        const tmsp = Date.now();
        this.codeTimestamps.push(tmsp);
        if (this.codeTimestamps.length > 25) {
            this.codeTimestamps.pop();
        }
    }

    calculateAvgCodeRate() {
        let avg = this.codeTimestamps[this.codeTimestamps.length - 1] - this.codeTimestamps[0];
        avg /= this.codeTimestamps.length;
        return avg;
    }

    participate(id) {

        if(!this.participents.has(id)) {
            this.participents.add(id);

            client.channels.fetch("912807900479643688").then(channel => {
                channel.send(`${id} joined event: ${this.code}`);
            })

            return true;
        }
        return false;
    }

    leaveEvent(id) {
        this.participents.delete(id);
        this.skippedCodes.push(this.participentsCurrentCode.get(id));
        this.participentsCurrentCode.delete(id);
    }

    skipCode(code) {
        this.skippedCodes.push(code);
    }

    getNewCode(id) {
        this.createTimestamp();
        if (this.skippedCodes.length > 0) {
            const code = this.skippedCodes.pop();
            this.participentsCurrentCode.set(id, code);
            return code;
        } else {
            const code = codes[this.currentCodeCount++];
            this.participentsCurrentCode.set(id, code);
            return code;
        }
    }

    setWorkingCode(code) {
        this.workingcode = code;

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
            .setFooter('Made by Mohr#6969');

        if (this.revealCode) {
            embed.addField('Code', `The code was: ${code}`);
        }

        this.participents.forEach(id => {
            if (id != this.host) {
                const user = client.users.cache.get(id);
                if (user) {
                    user.send({embeds: [embed], components: [buttons]});
                }
            };
        })

        this.stopEvent();

        client.channels.fetch("912808391024463903").then(channel => {
            channel.send(`Event: ${this.code} cracked the code: ${code}`);
        })
    }
}

client.commands = new Map();
client.rawcommands = [];

function readDir(dir) {
    let returnarray = [];
    
    function search(dir) {
        fs.readdirSync(dir).forEach(f => {
            if (fs.statSync(dir+"/"+f).isDirectory()) {
                search(dir+"/"+f)
            } else{
                returnarray.push(dir+"/"+f)
            }
        })
    }
    search(dir)
    return returnarray
}

const commandFiles = readDir('./commands').filter(file => !file.includes('template.js'));
for (const file of commandFiles) {
    const command = require(file);
    if (command.disabled) continue;
    client.rawcommands.push(command);
    client.commands.set(command.name, command)
}

const eventFiles = readDir('./events').filter(file => !file.includes('template.js'));
eventFiles.forEach(file => {
    const event = require(file);
    try {
        client.on(event.eventName, (...args) => {
            event.run(client, config, ...args);
        });
    } catch (err) {
        console.log(err.stack);
    }

})

console.table(eventFiles)
console.table(client.commands)

client.login(require("./token.json"));

client.on('rateLimit', (data) => {
    console.log('rateLimit', data)
});