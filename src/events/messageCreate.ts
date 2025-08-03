import { createChat, generateResponseWithChat } from '../lib/genai/services.js';
import { GenerationConfig } from '../lib/types.js';
import { Message, Client } from 'discord.js';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import * as dt from '../lib/dataTransformation.js';
import * as log from '../lib/logging.js';
import {
    sendTypingIndicator,
    botShouldReply,
    sendMessage,
} from '../discord/interactionUtils.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});

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

    const messageData = dt.getMessageData(message);

    // Getting bot name: config file defines a custon name in case
    // application don't load the bot's global name or username.
    // Also, if the config option `forceCustomName` is set to true,
    // the custom name will be used instead of the global name or username.
    // This bot name is just used by the Gemini API in systemInstructions
    const botName = config.messageCreate.forceCustomName
        ? config.botInfo.customName
        : client.user?.globalName ||
          client.user?.username ||
          config.botInfo.customName;

    const content = await dt.createParts(
        messageData.prompt,
        message.attachments,
    );

    log.newMentionLog(messageData);

    // Fetching the linked message chain for more context
    const history = await dt.createHistory(message, client);

    // This object is used to configure the chat generation.
    // For more information, check the Google GenAI documentation.
    const chatConfig: GenerationConfig = {
        model: config.messageCreate.generation.model,
        temperature: config.messageCreate.generation.temperature,
        thinkingBudget: config.messageCreate.generation.thinkingBudget,
        botName: botName,
    };

    let chat: Chat | null = null;
    try {
        chat = await createChat(gemini, history, messageData, chatConfig);
    } catch (error) {
        message.reply(config.messageCreate.errorMessage);
        log.newCreateChatErrorLog({
            currentTime: messageData.currentTime,
            error: error,
            history: history,
        });
        return;
    }

    let response: GenerateContentResponse | null = null;
    try {
        response = await generateResponseWithChat(chat, content);
    } catch (error) {
        log.newSendMessageErrorLog({
            time: messageData.currentTime,
            error: error,
            content: messageData.prompt,
            history: history,
        });
        message.reply(config.messageCreate.errorMessage);
        return;
    }

    log.newResponseLog({
        currentTime: messageData.currentTime,
        responseText: response?.text || '(no text)',
        modelVersion: response?.modelVersion || '(unknown model version)',
        usageMetadata: dt.formatUsageMetadata(response?.usageMetadata),
        finishReason:
            response?.candidates?.[0]?.finishReason ||
            '(unknown finish reason)',
    });

    if (!response || !response.text) {
        message.reply(config.messageCreate.errorMessage);
        return;
    }

    // This function split the response into multiple
    // messages if it exceeds the maximum length allowed by Discord.
    sendMessage(
        response.text,
        message,
        async (messageToReply: Message, reply: string) => {
            return await messageToReply.reply(reply);
        },
    );

    return;
}
