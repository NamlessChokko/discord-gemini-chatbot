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

interface CustomClient extends Client {
    commands?: Collection<string, unknown>;
}

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

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));

const commandPromises = commandFiles.map((file) => {
    const filePath = path.join(commandsPath, file);
    return import(filePath);
});

const commands = await Promise.all(commandPromises);

for (const command of commands) {
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(
            `[ WARNING ] > A command file is missing 'data' or 'execute'`,
        );
    }
}

const eventPath = path.join(__dirname, 'events');
const eventFiles = fs
    .readdirSync(eventPath)
    .filter((file) => file.endsWith('.js'));

const eventPromises = eventFiles.map((file) => {
    const filePath = path.join(eventPath, file);
    return import(filePath);
});

const events = await Promise.all(eventPromises);

for (const event of events) {
    if (event.once) {
        client.once(event.name, (...args: unknown[]) =>
            event.execute(...args, client, gemini),
        );
    } else {
        client.on(event.name, (...args: unknown[]) => {
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
