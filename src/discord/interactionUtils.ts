import {
    Channel,
    TextChannel,
    NewsChannel,
    Message,
    Client,
    User,
} from 'discord.js';

const MAX_MESSAGE_LENGTH = 2000;

/**
 * Sends a typing indicator to a Discord channel if it supports typing.
 * This provides visual feedback to users that the bot is processing their message.
 *
 * @param channel - The Discord channel to send the typing indicator to
 * @returns void
 *
 * @remarks
 * - Only works with TextChannel and NewsChannel types
 * - Other channel types (like DM, Voice, etc.) are silently ignored
 * - Typing indicator automatically disappears after a few seconds or when a message is sent
 * - Useful for indicating the bot is working on generating a response
 *
 * @example
 * ```typescript
 * sendTypingIndicator(message.channel);
 * // User sees "Bot is typing..." indicator
 * ```
 */
export function sendTypingIndicator(channel: Channel): void {
    if (channel instanceof TextChannel || channel instanceof NewsChannel) {
        channel.sendTyping();
    }
}

/**
 * Determines whether the bot should reply to a given Discord message.
 * This function implements the core logic for when the bot should engage with users.
 *
 * @param message - The Discord message to evaluate
 * @param client - The Discord client instance (represents the bot)
 * @returns true if the bot should reply, false otherwise
 *
 * @remarks
 * The bot will reply if ALL of the following conditions are met:
 * - In DM channels: Always replies to any message with content
 * - In server channels: Only replies if the bot is mentioned (@botname)
 * - Message is not an @everyone mention (avoids spam)
 * - Message is not from the bot itself (prevents self-replies)
 * - Message has actual content (not just attachments/embeds)
 *
 * @example
 * ```typescript
 * if (botShouldReply(message, client)) {
 *     // Process and generate response
 *     await generateAIResponse(message);
 * }
 * ```
 */
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

/**
 * Sends a message to Discord, automatically splitting it into multiple messages if it exceeds the character limit.
 * This function handles Discord's 2000 character limit by intelligently breaking long responses at word boundaries.
 *
 * @param reply - The complete message text to send
 * @param messageToReply - The original Discord message to reply to
 * @param callback - Function that handles the actual sending of each message chunk
 * @returns A promise that resolves when all message chunks have been sent
 *
 * @remarks
 * - Discord has a 2000 character limit per message
 * - Messages are split at word boundaries to maintain readability
 * - Each subsequent message replies to the previous bot message (creates a thread-like chain)
 * - If the message fits within the limit, it's sent as a single message
 * - Empty or whitespace-only final chunks are not sent
 * - The callback function should handle the actual Discord API call
 *
 * @example
 * ```typescript
 * await sendMessage(
 *     longAIResponse,
 *     userMessage,
 *     async (msgToReply, chunk) => {
 *         return await msgToReply.reply(chunk);
 *     }
 * );
 * ```
 */
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
