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
