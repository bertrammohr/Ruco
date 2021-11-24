# Introducing RUCO (Raid Using Codes Only)
Ruco is a Discord bot specifically made for Rust code raiding. You can use it no matter the size of your group.

##How does it work?
Using the command: [/createevent](https://imgur.com/a5itJnN) you'll receive a [signup code](https://imgur.com/Mv22SCJ). Share this with your friends or community. They can now use the [/signup](https://imgur.com/TamyY5J) command, to join.

When enough people have joined, you can do [/startevent](https://imgur.com/wR1JNx4). When you do this, all participants receive a [DM from the bot](https://imgur.com/bQfYHkl), on which codes to check. After 10 codes, you'll be able to see the average time (from the last 25 codes checked) used to check 1 code. We scale this to make a [statistical estimate](https://imgur.com/udvOqWy) on when you're done raiding (Math based on [Daniel Miesl's data](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/four-digit-pin-codes-sorted-by-frequency-withcount.csv)).

When the right code is found, press the green button marking the code as working. If you're the host, all participants receive a message saying [the code was found](https://imgur.com/k5bP4po). If you're not the host, the host will receive a message to [validate the code](https://imgur.com/pnNsaoo), before ending the event. The code only shows up, if you chose to reveal the code in the [/createevent](https://imgur.com/a5itJnN) command.

##How do I set it up?
Start by inviting the bot to a Discord server of yours using [this](https://discord.com/api/oauth2/authorize?client_id=911984362420060220&permissions=2048&scope=bot%20applications.commands) link. *Please allow the permissions.*
Afterward, you can either use the commands in a channel, or your DMs with the bot (This is also where you'll be getting your codes). You can find all Ruco commands by typing / in a text channel where Ruco has access, or in a DM with Ruco.

##There's an error, what do I do?
Please contact Mohr#6969 on Discord. I'll be replying and fixing as well as I can.
