import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import {
    Client,
    Message,
    InteractionType,
    Collection,
    Attachment,
} from 'discord.js';
import {
    Part,
    Content,
    GenerateContentResponseUsageMetadata,
} from '@google/genai';
import { MessageData } from './types.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extracts and formats message data from a Discord message for processing.
 *
 * @param message - The Discord message object to extract data from
 * @returns An object containing formatted message data including timestamp, location, author, and content
 *
 * @example
 * ```typescript
 * const messageData = getMessageData(discordMessage);
 * console.log(messageData.author); // "John Doe"
 * console.log(messageData.location); // "Server: My Server -> general"
 * ```
 */
export function getMessageData(message: Message): MessageData {
    const currentTime = new Date().toString();
    const location = message.channel.isDMBased()
        ? 'Direct Message'
        : `Server: ${message.guild?.name} -> ${message.channel.name} `;
    const author =
        message.author?.globalName ||
        message.author?.username ||
        'Unknown User';
    const prompt = message.content.trim();

    return {
        currentTime,
        location,
        author,
        prompt,
    };
}

/**
 * Creates a conversation history by traversing message references backwards.
 * This function follows the reply chain to build context for AI generation.
 *
 * @param message - The starting Discord message to build history from
 * @param client - The Discord client instance used to identify bot messages
 * @returns A promise that resolves to an array of Content objects representing the conversation history
 *
 * @remarks
 * - The function stops at slash command interactions or when maxHistoryLength is reached
 * - Messages from the bot are marked with role 'model', user messages with role 'user'
 * - History is built in reverse chronological order (oldest first)
 * - Includes special handling for slash command metadata
 *
 * @example
 * ```typescript
 * const history = await createHistory(message, discordClient);
 * console.log(history.length); // Number of messages in history
 * ```
 */
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

/**
 * Converts a Discord message and its attachments into Google GenAI Part objects.
 * This function handles both text content and media attachments for AI processing.
 *
 * @param message - The text content of the message
 * @param media - A collection of Discord attachments to process
 * @returns A promise that resolves to an array of Part objects suitable for GenAI
 *
 * @remarks
 * - Text content is added as a text part if present
 * - Media attachments are converted to base64 inline data parts
 * - MIME types are cleaned to remove charset information
 * - Failed attachment downloads are logged and skipped
 * - Supports any attachment type that Discord allows
 *
 * @example
 * ```typescript
 * const parts = await createParts(message.content, message.attachments);
 * console.log(parts[0].text); // Message text
 * console.log(parts[1].inlineData); // First attachment data
 * ```
 */
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

                let mimeType =
                    attachment.contentType || 'application/octet-stream';

                if (mimeType.includes('; charset=utf-8')) {
                    mimeType = mimeType.split(';')[0].trim();
                }

                parts.push({
                    inlineData: {
                        mimeType: mimeType,
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

/**
 * Formats Google GenAI usage metadata into a readable indented string.
 * This function is used for logging and debugging API usage information.
 *
 * @param usageMetadata - The usage metadata object from a GenAI response, or undefined
 * @returns A formatted string representation of the usage metadata
 *
 * @remarks
 * - Returns a placeholder message if no metadata is provided
 * - Formats the JSON with 2-space indentation
 * - Adds 3 additional spaces at the beginning of each line for consistent formatting
 * - Useful for logging token usage, costs, and other API metrics
 *
 * @example
 * ```typescript
 * const formatted = formatUsageMetadata(response.usageMetadata);
 * console.log('Usage stats:', formatted);
 * // Output:
 * //    {
 * //      "promptTokenCount": 150,
 * //      "candidatesTokenCount": 75
 * //    }
 * ```
 */
export function formatUsageMetadata(
    usageMetadata: GenerateContentResponseUsageMetadata | undefined,
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

export function imageFromParts(parts: Part[]): string {
    let imageBuffer: Buffer | null = null;

    for (const part of parts) {
        if (part.inlineData?.data) {
            imageBuffer = Buffer.from(part.inlineData.data, 'base64');
        }
    }

    if (!imageBuffer) {
        throw new Error('No image data found in parts');
    }

    const imgPath = path.join(__dirname, 'out.png');
    fs.writeFileSync(imgPath, imageBuffer);
    return imgPath;
}
