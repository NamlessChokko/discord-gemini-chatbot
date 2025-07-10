import { Collection, Message, User, Client } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
import { CustomClient } from './types.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});
import {
    GenerateContentResponse,
    GenerateContentResponseUsageMetadata,
    Content,
} from '@google/genai';

export function substituteMentionUsernames(
    content: string,
    mentions: Collection<string, User>,
): string {
    if (!content || content.length === 0) {
        return '';
    }
    if (!mentions || mentions.size === 0) {
        return content;
    }
    for (const user of mentions.values()) {
        const regex = new RegExp(`<@!?${user.id}>`, 'g');
        content = content.replace(regex, user.username);
    }
    return content;
}
export function substituteNamesWithMentions(
    content: string | undefined,
    mentions: Collection<string, User>,
): string {
    if (!content || content.length === 0) {
        return '';
    }
    if (!mentions || mentions.size === 0) {
        return content;
    }
    for (const user of mentions.values()) {
        const regex = new RegExp(`\\b${user.username}\\b`, 'gi');
        content = content.replace(regex, `<@${user.id}>`);
    }
    return content;
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

export function validReply(response: GenerateContentResponse | null): boolean {
    if (!response) {
        return false;
    }

    try {
        const text = response.text;

        if (!text || text.trim().length === 0) {
            return false;
        }

        if (text.trim().length > 2000) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

export async function createHistory(
    message: Message,
    client: Client,
): Promise<Content[]> {
    const maxHistoryLengthConfig =
        config.messageCreateConfigs.generationParameters.maxHistoryLength || 10;
    const maxHistoryLength =
        maxHistoryLengthConfig > 0
            ? maxHistoryLengthConfig
            : Number.MAX_SAFE_INTEGER;
    const history: Content[] = [];
    let cursor: Message = message;

    while (cursor.reference && cursor.reference.messageId) {
        const parent = await message.channel.messages.fetch(
            cursor.reference.messageId,
        );

        const role = parent.author.id === client.user?.id ? 'model' : 'user';

        history.unshift({
            role,
            parts: [{ text: parent.content }],
        });

        if (history.length >= maxHistoryLength && role === 'user') {
            break;
        }

        cursor = parent;
    }

    return history;
}

export function formatUsageMetadata(
    usageMetadata: GenerateContentResponseUsageMetadata | null | undefined,
): string {
    if (!usageMetadata) {
        return '(no usage metadata)';
    }

    const responseFormated = JSON.stringify(usageMetadata, null, 2)
        .split('\n')
        .map((line) => `   ${line}`)
        .join('\n');
    return responseFormated;
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[ WARNING ] > A command file is missing 'data' or 'execute'`,
            );
        }
    }
}

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
                event.execute(...args, client, gemini),
            );
        } else {
            client.on(event.name, (...args: unknown[]) => {
                event.execute(...args, client, gemini);
            });
        }
    }
}
