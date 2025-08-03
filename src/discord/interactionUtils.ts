import {
    Channel,
    TextChannel,
    NewsChannel,
    Message,
    Client,
    User,
} from 'discord.js';

const MAX_MESSAGE_LENGTH = 2000;

export function sendTypingIndicator(channel: Channel): void {
    if (channel instanceof TextChannel || channel instanceof NewsChannel) {
        channel.sendTyping();
    }
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

export async function sendMessage(
    reply: string,
    messageToReply: Message,
    callback: (messageToReply: Message, reply: string) => Promise<Message>,
): Promise<void> {
    if (reply.length <= MAX_MESSAGE_LENGTH) {
        callback(messageToReply, reply);
        return;
    }

    let currentMessage = '';
    let lastSentMessage = messageToReply;

    for (const word of reply.split(' ')) {
        if (currentMessage.length + word.length + 1 > MAX_MESSAGE_LENGTH) {
            lastSentMessage = await callback(
                lastSentMessage,
                currentMessage.trim(),
            );
            currentMessage = word + ' ';
        } else {
            currentMessage += `${word} `;
        }
    }

    // Enviamos el último fragmento si queda contenido
    if (currentMessage.trim().length > 0) {
        callback(lastSentMessage, currentMessage.trim());
    }
}
