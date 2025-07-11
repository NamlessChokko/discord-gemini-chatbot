import { Collection } from 'discord.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});
export function substituteMentionUsernames(content, mentions) {
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
export function substituteNamesWithMentions(content, mentions) {
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
export function botShouldReply(message, client) {
    if (!message.channel.isDMBased() &&
        !message.mentions.has(client.user)) {
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
export function validReply(response) {
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
    }
    catch {
        return false;
    }
}
export async function createHistory(message, client) {
    const maxHistoryLengthConfig = config.messageCreateConfigs.generationParameters.maxHistoryLength || 10;
    const maxHistoryLength = maxHistoryLengthConfig > 0
        ? maxHistoryLengthConfig
        : Number.MAX_SAFE_INTEGER;
    const history = [];
    let cursor = message;
    while (cursor.reference && cursor.reference.messageId) {
        const parent = await message.channel.messages.fetch(cursor.reference.messageId);
        const role = parent.author.id === client.user?.id ? 'model' : 'user';
        const parts = createParts(parent.content, parent.attachments);
        history.unshift({
            role,
            parts: await parts,
        });
        if (history.length >= maxHistoryLength && role === 'user') {
            break;
        }
        cursor = parent;
    }
    return history;
}
export function formatUsageMetadata(usageMetadata) {
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
export async function loadCommands(client) {
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
        }
        else {
            console.log(`[ WARNING ] > A command file is missing 'data' or 'execute'`);
        }
    }
}
export async function loadEvents(client, gemini) {
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
            client.once(event.name, (...args) => event.execute(...args, gemini, client));
        }
        else {
            client.on(event.name, (...args) => {
                event.execute(...args, gemini, client);
            });
        }
    }
}
export async function createParts(message, media) {
    const parts = [];
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
                    console.error(`Failed to fetch attachment: ${attachment.url} - ${file.statusText}`);
                    continue;
                }
                const buffer = await file.arrayBuffer();
                const base64Data = Buffer.from(buffer).toString('base64');
                console.log(`Processing attachment: ${attachment.name} - (${attachment.contentType})`);
                parts.push({
                    inlineData: {
                        mimeType: attachment.contentType ||
                            'application/octet-stream',
                        data: base64Data,
                    },
                });
            }
            catch (error) {
                console.error(`Error processing attachment: ${attachment.name}`, error);
            }
        }
    }
    return parts;
}
