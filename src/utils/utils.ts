import { Collection, Message, User, Client } from 'discord.js';
import { GenerateContentResponse } from '@google/genai';

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
    } catch (error) {
        return false;
    }
}

export async function createHistory(message: Message, client: Client) {
    const history = [];
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
        cursor = parent;
    }

    return history;
}
