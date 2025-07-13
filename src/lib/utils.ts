import {
    Collection,
    Message,
    User,
    Client,
    Attachment,
    InteractionType,
} from 'discord.js';
import { GoogleGenAI, Part } from '@google/genai';
import { CustomClient } from './types.js';
import util from 'node:util';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});
import {
    GenerateContentResponse,
    GenerateContentResponseUsageMetadata,
    Content,
} from '@google/genai';

const logFile = fs.createWriteStream(config.application.logFile, {
    flags: 'a',
});

export function logToFile(message: string) {
    logFile.write(util.format(message) + '\n');
}

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
        return true;
    } catch {
        return false;
    }
}

export async function createHistory(
    message: Message,
    client: Client,
): Promise<Content[]> {
    const history: Content[] = [];
    let cursor: Message = message;
    const maxHistoryLength =
        config.messageCreate.generation.maxHistoryLength > 0
            ? config.messageCreate.generation.maxHistoryLength
            : Number.MAX_SAFE_INTEGER;

    while (cursor.reference && cursor.reference.messageId) {
        const parent = await message.channel.messages.fetch(
            cursor.reference.messageId,
        );

        const role = parent.author.id === client.user?.id ? 'model' : 'user';

        history.unshift({
            role: role,
            parts: await createParts(parent.content, parent.attachments),
        });

        if (
            parent.interactionMetadata &&
            parent.interactionMetadata.type ===
                InteractionType.ApplicationCommand &&
            role === 'model'
        ) {
            history.unshift(
                {
                    role: 'user',
                    parts: [
                        {
                            text: `[Slash Command by: ${parent.interactionMetadata.user.username}]`,
                        },
                    ],
                },
                {
                    role: 'model',
                    parts: [
                        {
                            text: `This message was generated in response to a slash command interaction.`,
                        },
                    ],
                },
            );
            break;
        }

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

import { commandWarningLog } from './logging.js';

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
        const cmd = command.default || command;
        if ('data' in cmd && 'execute' in cmd && 'helpMessage' in cmd) {
            client.commands.set(cmd.data.name, cmd);
        } else {
            commandWarningLog(
                cmd.data?.name,
                'data' in cmd,
                'execute' in cmd,
                'helpMessage' in cmd,
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
                event.execute(...args, gemini, client),
            );
        } else {
            client.on(event.name, (...args: unknown[]) => {
                event.execute(...args, gemini, client);
            });
        }
    }
}

export async function createParts(
    message: string,
    media: Collection<string, Attachment>,
): Promise<Part[]> {
    const parts: Part[] = [];

    if (message && message.length > 0) {
        parts.push({
            text: message,
        });
    }

    if (media && media.size > 0) {
        for (const attachment of media.values()) {
            try {
                const file = await fetch(attachment.url);
                if (!file.ok) {
                    console.error(
                        `Failed to fetch attachment: ${attachment.url} - ${file.statusText}`,
                    );
                    continue;
                }
                const buffer = await file.arrayBuffer();
                const base64Data = Buffer.from(buffer).toString('base64');

                console.log(
                    `Processing attachment: ${attachment.name} - (${attachment.contentType})`,
                );
                parts.push({
                    inlineData: {
                        mimeType:
                            attachment.contentType ||
                            'application/octet-stream',
                        data: base64Data,
                    },
                });
            } catch (error) {
                console.error(
                    `Error processing attachment: ${attachment.name}`,
                    error,
                );
            }
        }
    }

    return parts;
}

export function devideLongMessages(
    message: string,
    maxLength: number = 2000,
): string[] {
    if (message.length <= maxLength) {
        return [message];
    }

    const parts: string[] = [];
    let currentPart = '';

    for (const word of message.split(' ')) {
        if (currentPart.length + word.length + 1 > maxLength) {
            parts.push(currentPart.trim());
            currentPart = '';
        }
        currentPart += `${word} `;
    }

    if (currentPart.length > 0) {
        parts.push(currentPart.trim());
    }

    return parts;
}
