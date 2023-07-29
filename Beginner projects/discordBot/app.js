require("dotenv").config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.on('ready', () => {
    console.log(`${client.user.tag}`);
})

client.login(process.env.DISCORD_BOT_TOKEN);

