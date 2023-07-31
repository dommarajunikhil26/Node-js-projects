require("dotenv").config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    console.log(`${message.author.tag} : ${message.content}`);

    if (message.content.toLowerCase() === "hello" || message.content.toLowerCase() === "hey" || message.content.toLowerCase() === "hi") {
        message.channel.send("Hey there!");
    }

    if (message.content.startsWith('/kick') && message.member.hasPermission('KICK_MEMBERS')) {
        const memberToKick = message.mentions.members.first();
        if (!memberToKick) {
            message.channel.send('Please mention the user you want to kick.');
            return;
        }

        try {
            await memberToKick.kick();
            message.channel.send(`${memberToKick.user.tag} has been kicked from the server.`);
        } catch (error) {
            message.channel.send('An error occurred while trying to kick the member.');
            console.error(error);
        }
    }

    
});

client.login(process.env.DISCORD_BOT_TOKEN);
