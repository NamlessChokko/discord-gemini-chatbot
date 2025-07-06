import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createServer } from 'node:http';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = createServer();
server.listen(3000, '0.0.0.0');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
});
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
    else {
        console.log(`[ WARNING ] > ${file} expected 'data' & 'execute'`);
    }
}
const eventPath = path.join(__dirname, 'events');
const eventFiles = fs
    .readdirSync(eventPath)
    .filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventPath, file);
    const event = await import(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client, gemini));
    }
    else {
        client.on(event.name, (...args) => {
            event.execute(...args, client, gemini);
        });
    }
}
client.login(process.env.DISCORD_TOKEN);
client.on('ready', () => {
    console.log('Gemini is ready 7u7');
});
client.on('error', (error) => {
    console.error('Discord client error:', error);
});
