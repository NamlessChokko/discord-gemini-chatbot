import { Message, Client } from 'discord.js';
import { GoogleGenAI, Content } from '@google/genai';
import {
    newMentionLog,
    newResponseLog,
    newReplyLengthErrorLog,
    newCreateChatErrorLog,
    newSendMessageErrorLog,
} from '../lib/logging.js';
import {
    validReply,
    botShouldReply,
    substituteMentionUsernames,
    substituteNamesWithMentions,
    createHistory,
} from '../lib/utils.js';

export const name = 'messageCreate';
export async function execute(
    message: Message,
    client: Client,
    gemini: GoogleGenAI,
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
    const content = substituteMentionUsernames(
        message.content,
        message.mentions.users,
    );

    const botName =
        client.user?.globalName || client.user?.username || 'Gemini Chatbot';

    const systemInstruction = [
        // TODO external config file for this
        'YOUR ROLE: You are a discord chatbot',
        `You are called ${botName}`,
        `User to respond: ${authorName}`,
        'Your responses should be as neutral and informative as possible, but if you detect a joking tone in a message, you can answer with a funny tone',
        'LIMITATION: Your messages have to be less than 2000 chars long because of the discord limits.',
        'You should use markdown to format your messages any time you can, but DO NOT use markdown tables.',
        'You should use emojis to make your messages more friendly, but do not overuse them.',
        'If the message is empty, you should respond with a frienly greeting.',
        `EXTRA INFORMATION: Current time is: ${currentTime}`,
    ];

    const botReply = await message.reply('Thinking...');
    const isDM = message.channel.isDMBased();

    const location = isDM
        ? 'DM'
        : `${message.guild?.name} -> ${message.channel.name}`;

    newMentionLog(currentTime, authorName, content, isDM, location);

    const history: Content[] = await createHistory(message, client);
    let chat;
    try {
        chat = gemini.chats.create({
            // model: 'gemini-2.5-flash-lite-preview-06-17',
            // model: 'gemini-2.5-pro',
            model: 'gemini-2.5-flash',
            config: {
                temperature: 0.7,
                maxOutputTokens: 500, // Approximately 2000 characters
                systemInstruction: systemInstruction,
                thinkingConfig: {
                    thinkingBudget: 0,
                },
            },
            history: history,
        });
    } catch (error) {
        botReply.edit(errorMessage);
        newCreateChatErrorLog(currentTime, error, history);
        return;
    }

    let response;
    try {
        response = await chat.sendMessage({
            message: content,
        });
    } catch (error) {
        newSendMessageErrorLog(currentTime, error, content, history);
        botReply.edit(errorMessage);
        return;
    }

    const responseText = response?.text || '(no text)';
    const modelVersion = response?.modelVersion || '(unknown model version)';
    const usageMetadata = response?.usageMetadata
        ? JSON.stringify(response.usageMetadata, null, 2)
              .split('\n')
              .map((line) => `   ${line}`)
              .join('\n')
        : '(no usage metadata)';
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
        newReplyLengthErrorLog(currentTime, responseText.length, isDM);
        return;
    }

    const finalResponse = substituteNamesWithMentions(
        response.text,
        message.mentions.users,
    );

    botReply.edit(finalResponse);

    return;
}
