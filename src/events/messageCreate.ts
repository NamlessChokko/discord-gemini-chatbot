import systemInstructions from '../lib/systemInstructions.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});
import { Message, Client } from 'discord.js';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import {
    newMentionLog,
    newResponseLog,
    newCreateChatErrorLog,
    newSendMessageErrorLog,
} from '../lib/logging.js';
import {
    botShouldReply,
    sendTypingIndicator,
    validReply,
} from '../lib/discordApi.js';
import {
    substituteMentionUsernames,
    substituteNamesWithMentions,
    createHistory,
    createParts,
    devideLongMessages,
} from '../lib/replyBody.js';

import { formatUsageMetadata } from '../lib/formatting.js';

export const name = 'messageCreate';
export async function execute(
    message: Message,
    gemini: GoogleGenAI,
    client: Client,
) {
    if (!botShouldReply(message, client)) {
        return;
    }

    sendTypingIndicator(message.channel);

    const currentTime = new Date().toString();
    const location = message.channel.isDMBased()
        ? 'Direct Message'
        : `Server: ${message.guild?.name} -> ${message.channel.name} `;
    const authorName =
        message.author?.globalName ||
        message.author?.username ||
        'Unknown User';
    const botName = config.messageCreate.forceCustomName
        ? config.botInfo.customName
        : client.user?.globalName ||
          client.user?.username ||
          config.botInfo.customName;

    const prompt = substituteMentionUsernames(
        message.content,
        message.mentions.users,
    );

    const content = createParts(prompt, message.attachments);
    const systemInstruction = systemInstructions.messageCreate(
        botName,
        authorName,
        location,
        currentTime,
    );

    newMentionLog(currentTime, authorName, prompt, location);

    const history = await createHistory(message, client);
    let chat: Chat | null = null;
    try {
        chat = gemini.chats.create({
            model: config.messageCreate.generation.model,
            config: {
                temperature: config.messageCreate.generation.temperature,
                systemInstruction: systemInstruction,
                thinkingConfig: {
                    thinkingBudget:
                        config.messageCreate.generation.thinkingBudget,
                },
            },
            history: history,
        });
    } catch (error) {
        message.reply(config.messageCreate.errorMessage);
        newCreateChatErrorLog(currentTime, error, history);
        return;
    }

    let response: GenerateContentResponse | null = null;
    try {
        response = await chat.sendMessage({
            message: await content,
        });
    } catch (error) {
        newSendMessageErrorLog(currentTime, error, prompt, history);
        message.reply(config.messageCreate.errorMessage);
        return;
    }

    const responseText = response?.text || '(no text)';
    const modelVersion = response?.modelVersion || '(unknown model version)';
    const usageMetadata = formatUsageMetadata(response?.usageMetadata);
    const finishReason =
        response?.candidates?.[0]?.finishReason || '(unknown finish reason)';

    newResponseLog(
        currentTime,
        responseText,
        modelVersion,
        usageMetadata,
        finishReason,
    );

    if (!validReply(response)) {
        message.reply(config.messageCreate.errorMessage);
        return;
    }

    if ((response as { text: string }).text.length > 2000) {
        const longMessages = devideLongMessages(
            (response as { text: string }).text,
            2000,
        );
        const firstMessage = longMessages.shift();

        if (!firstMessage) {
            message.reply(config.messageCreate.errorMessage);
            return;
        }

        let lastReply = await message.reply(firstMessage);

        for (const message of longMessages) {
            const newReply = await lastReply.reply(message);
            lastReply = newReply;
        }
        return;
    }

    const finalResponse = substituteNamesWithMentions(
        response.text,
        message.mentions.users,
    );

    message.reply(finalResponse);

    return;
}
