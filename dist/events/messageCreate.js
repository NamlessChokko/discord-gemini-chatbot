import systemInstructions from '../lib/systemInstructions.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});
import { newMentionLog, newResponseLog, newCreateChatErrorLog, newSendMessageErrorLog, } from '../lib/logging.js';
import { validReply, botShouldReply, substituteMentionUsernames, substituteNamesWithMentions, createHistory, formatUsageMetadata, createParts, devideLongMessages, } from '../lib/utils.js';
export const name = 'messageCreate';
export async function execute(message, gemini, client) {
    if (!botShouldReply(message, client)) {
        return;
    }
    const botReply = await message.reply('Thinking...');
    const currentTime = new Date().toString();
    const location = message.channel.isDMBased()
        ? 'Direct Message'
        : `Server: ${message.guild?.name} -> ${message.channel.name} `;
    const authorName = message.author?.globalName ||
        message.author?.username ||
        'Unknown User';
    const botName = config.messageCreate.forceCustomName
        ? config.botInfo.customName
        : client.user?.globalName ||
            client.user?.username ||
            config.botInfo.customName;
    const prompt = substituteMentionUsernames(message.content, message.mentions.users);
    const content = createParts(prompt, message.attachments);
    const systemInstruction = systemInstructions.messageCreate(botName, authorName, location, currentTime);
    newMentionLog(currentTime, authorName, prompt, location);
    const history = await createHistory(message, client);
    let chat = null;
    try {
        chat = gemini.chats.create({
            model: config.messageCreate.generation.model,
            config: {
                temperature: config.messageCreate.generation.temperature,
                systemInstruction: systemInstruction,
                thinkingConfig: {
                    thinkingBudget: config.messageCreate.generation.thinkingBudget,
                },
            },
            history: history,
        });
    }
    catch (error) {
        botReply.edit(config.messageCreate.errorMessage);
        newCreateChatErrorLog(currentTime, error, history);
        return;
    }
    let response = null;
    try {
        response = await chat.sendMessage({
            message: await content,
        });
    }
    catch (error) {
        newSendMessageErrorLog(currentTime, error, prompt, history);
        botReply.edit(config.messageCreate.errorMessage);
        return;
    }
    const responseText = response?.text || '(no text)';
    const modelVersion = response?.modelVersion || '(unknown model version)';
    const usageMetadata = formatUsageMetadata(response?.usageMetadata);
    const finishReason = response?.candidates?.[0]?.finishReason || '(unknown finish reason)';
    newResponseLog(currentTime, responseText, modelVersion, usageMetadata, finishReason);
    if (!validReply(response)) {
        botReply.edit(config.messageCreate.errorMessage);
        return;
    }
    if (response.text.length > 2000) {
        const longMessages = devideLongMessages(response.text, 2000);
        const firstMessage = longMessages.shift();
        if (firstMessage) {
            botReply.edit(firstMessage);
        }
        for (const message of longMessages) {
            await botReply.reply(message);
        }
        return;
    }
    const finalResponse = substituteNamesWithMentions(response.text, message.mentions.users);
    botReply.edit(finalResponse);
    return;
}
