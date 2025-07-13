import systemInstructions from '../lib/systemInstructions.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});
import { Message, Client } from 'discord.js';
import {
    GoogleGenAI,
    Content,
    Chat,
    GenerateContentResponse,
} from '@google/genai';
import {
    newMentionLog,
    newResponseLog,
    newCreateChatErrorLog,
    newSendMessageErrorLog,
} from '../lib/logging.js';
import {
    validReply,
    botShouldReply,
    substituteMentionUsernames,
    substituteNamesWithMentions,
    createHistory,
    formatUsageMetadata,
    createParts,
    devideLongMessages,
} from '../lib/utils.js';

export const name = 'messageCreate';
export async function execute(
    message: Message,
    gemini: GoogleGenAI,
    client: Client,
) {
    if (!botShouldReply(message, client)) {
        return;
    }

    const errorMessage =
        'Sorry, there was an error while processing your message. Please try again later.';
    const currentTime = new Date().toString();
    const authorName =
        message.author?.globalName ||
        message.author?.username ||
        'Unknown User';
    const prompt = substituteMentionUsernames(
        message.content,
        message.mentions.users,
    );
    const content = createParts(prompt, message.attachments);

    const botName =
        client.user?.globalName ||
        client.user?.username ||
        config.botInfo.customName;

    const botReply = await message.reply('Thinking...');
    const isDM = message.channel.isDMBased();

    const location = isDM
        ? 'DM'
        : `Server: ${message.guild?.name} -> ${message.channel.name} `;

    const systemInstruction = systemInstructions.messageCreate(
        botName,
        authorName,
        location,
        currentTime,
    );
    newMentionLog(currentTime, authorName, prompt, isDM, location);

    const history: Content[] = await createHistory(message, client);
    let chat: Chat | null = null;
    try {
        chat = gemini.chats.create({
            // model: 'gemini-2.5-flash-lite-preview-06-17',
            // model: 'gemini-2.5-pro',
            model: 'gemini-2.5-flash',
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
        botReply.edit(errorMessage);
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
        botReply.edit(errorMessage);
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
        botReply.edit(errorMessage);
        return;
    }

    if ((response as { text: string }).text.length > 2000) {
        const longMessages = devideLongMessages(
            (response as { text: string }).text,
            2000,
        );
        const firstMessage = longMessages.shift();
        if (firstMessage) {
            botReply.edit(firstMessage);
        }
        for (const message of longMessages) {
            await botReply.reply(message);
        }
        return;
    }

    const finalResponse = substituteNamesWithMentions(
        response.text,
        message.mentions.users,
    );

    botReply.edit(finalResponse);

    return;
}
