import { Collection, Message, User, Client } from 'discord.js';

export function substituteMentionUsernames(
    content: string,
    mentions: Collection<string, User>,
): string {
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
    content: string,
    mentions: Collection<string, User>,
): string {
    if (!mentions || mentions.size === 0) {
        return content;
    }
    for (const user of mentions.values()) {
        const regex = new RegExp(`\\b${user.username}\\b`, 'gi');
        content = content.replace(regex, `<@${user.id}>`);
    }
    return content;
}

export function botShouldReply(message: Message, client: Client) {
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
