import { Collection } from 'discord.js';
import { CustomClient } from '../lib/types.js';
import { GoogleGenAI } from '@google/genai';
import { commandWarningLog } from '../lib/logging.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

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
            commandWarningLog({
                commandName: cmd.data?.name,
                hasData: 'data' in cmd,
                hasExecute: 'execute' in cmd,
            });
        }
    }
}
