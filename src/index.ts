import 'dotenv/config';
import { createServer } from 'node:http';

import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
import { loadCommands, loadEvents } from './lib/utils.js';
import { CustomClient } from './lib/types.js';
import { clientReady, clientShutdown } from './lib/logging.js';

const server = createServer();
server.listen(3000, '0.0.0.0');

const client: CustomClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
});

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

loadCommands(client);
loadEvents(client, gemini);

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
    clientReady(new Date().toLocaleString());
});

client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('exit', () => {
    clientShutdown(new Date().toLocaleString());
});
