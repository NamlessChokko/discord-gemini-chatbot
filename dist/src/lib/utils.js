import config from '../../config.json' with { type: 'json' };
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
        !message.mentions.has(client.user) &&
        !message.author.bot) {
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
