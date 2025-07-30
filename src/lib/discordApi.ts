import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { commandWarningLog } from './logging.js';
import { CustomClient } from './types.js';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import {
    Collection,
    User,
    Client,
    Message,
    TextChannel,
    NewsChannel,
    DMChannel,
} from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadEvents(client: CustomClient, gemini: GoogleGenAI) {
    const eventPath = path.join(__dirname, '..', 'events');
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
                event.execute(...args, gemini, client),
            );
        } else {
            client.on(event.name, (...args: unknown[]) => {
                event.execute(...args, gemini, client);
            });
        }
    }
}

export async function loadCommands(client: CustomClient) {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'));

    const commandPromises = commandFiles.map((file) => {
        const filePath = path.join(commandsPath, file);
        return import(filePath);
    });

    const commands = await Promise.all(commandPromises);

    for (const command of commands) {
        const cmd = command.default || command;
        if ('data' in cmd && 'execute' in cmd) {
            client.commands.set(cmd.data.name, cmd);
        } else {
            commandWarningLog(cmd.data?.name, 'data' in cmd, 'execute' in cmd);
        }
    }
}

export function botShouldReply(message: Message, client: Client): boolean {
    if (
        !message.channel.isDMBased() &&
        !message.mentions.has(client.user as User)
    ) {
        return false;
    }

    if (message.mentions.everyone) {
        return false;
    }
    if (message.author.tag === client.user?.tag) {
        return false;
    }
    if (!message.content) {
        return false;
    }

    return true;
}

export function sendTypingIndicator(channel: unknown): void {
    if (
        channel instanceof TextChannel ||
        channel instanceof DMChannel ||
        channel instanceof NewsChannel
    ) {
        channel.sendTyping();
    }
}

export function validReply(response: GenerateContentResponse | null): boolean {
    if (!response) {
        return false;
    }

    try {
        const text = response.text;

        if (!text || text.trim().length === 0) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}
