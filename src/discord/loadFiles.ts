import { Collection } from 'discord.js';
import { CustomClient } from '../lib/types.js';
import { GoogleGenAI } from '@google/genai';
import { commandWarningLog } from '../lib/logging.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Dynamically loads and registers Discord event handlers from the events directory.
 * This is an internal client setup function that scans for event files and binds them to the Discord client.
 *
 * @param client - The CustomClient instance to register events on
 * @param gemini - The GoogleGenAI instance to pass to event handlers
 * @returns A promise that resolves when all events are loaded and registered
 *
 * @remarks
 * - Scans the '../events' directory for .js files
 * - Each event file must export 'name', 'execute', and optionally 'once' properties
 * - Events marked with 'once: true' are registered as one-time listeners
 * - Events without 'once' are registered as persistent listeners
 * - Both gemini and client instances are passed to event execute functions
 * - Uses dynamic imports for ES module compatibility
 *
 * @internal This function is called during client initialization, not by end users
 *
 * @example
 * ```typescript
 * // Called during bot startup
 * await loadEvents(discordClient, geminiInstance);
 * // Now events like 'messageCreate', 'interactionCreate' are active
 * ```
 */
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

/**
 * Dynamically loads and registers Discord slash commands from the commands directory.
 * This is an internal client setup function that scans for command files and adds them to the client's command collection.
 *
 * @param client - The CustomClient instance to register commands on
 * @returns A promise that resolves when all commands are loaded and registered
 *
 * @remarks
 * - Initializes the client.commands Collection if not already present
 * - Scans the '../commands' directory for .js files
 * - Each command file must export 'data' (SlashCommandBuilder) and 'execute' function
 * - Commands are stored in a Collection keyed by their command name
 * - Invalid commands (missing data/execute) are logged as warnings but don't break loading
 * - Supports both default exports and named exports
 * - Uses dynamic imports for ES module compatibility
 *
 * @internal This function is called during client initialization, not by end users
 *
 * @example
 * ```typescript
 * // Called during bot startup
 * await loadCommands(discordClient);
 * // Now commands like /ping, /help, /imagine are available
 * console.log(client.commands.size); // Number of loaded commands
 * ```
 */
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
