import 'dotenv/config';
import { createServer } from 'node:http';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
import { loadCommands, loadEvents } from './lib/utils.js';
var server = createServer();
server.listen(3000, '0.0.0.0');
var client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel
    ]
});
var gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
loadCommands(client);
loadEvents(client, gemini);
client.login(process.env.DISCORD_TOKEN);
client.on('ready', function() {
    console.log('Gemini is ready 7u7');
});
client.on('error', function(error) {
    console.error('Discord client error:', error);
});
