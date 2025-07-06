import { Message, Client } from 'discord.js';
import {
    substituteMentionUsernames,
    substituteNamesWithMentions,
} from '../utils/utils.js';

export const name = 'messageCreate';
export async function execute(message: Message, client: Client) {
    if (
        !message.channel.isDMBased() &&
        !message.mentions.has(client.user as any)
    ) {
        return;
    }

    if (message.mentions.everyone) {
        return;
    }
    if (message.author.tag === (client as any).tag) {
        return;
    }
    if (!message.content) {
        return;
    }

    const errorMessage =
        'Sorry, there was an error while processing your message. Please try again later.';
    const currentTime = new Date().toString();
    const authorName = message.author.globalName;
    const content = substituteMentionUsernames(
        message.content,
        message.mentions.users,
    );

    const botName =
        client.user?.globalName || client.user?.username || 'Gemini Chatbot';

    const systemInstruction = [
        'YOUR ROLE: You are a discord chatbot',
        `You are called ${botName}`,
        'Your responses should be as neutral and informative as possible, but if you detect a joking tone in a message, you can answer with a funny tone',
        "If a user start its prompt with 'DEV' you have to send exactly what the user is asking you. No jokes, just the petition.",
        'LIMITATION: Your messages have to be less than 2000 chars long because of the discord limits.',
        'You should use markdown to format your messages any time you can, but DO NOT use markdown tables.',
        'You should use emojis to make your messages more friendly, but do not overuse them.',
        'If the message is empty, you should respond with a frienly greeting.',
        `EXTRA INFORMATION: Current time is: ${currentTime}`,
        `User to respond: ${authorName}`,
    ];

    const replyMessage = await message.reply('Thinking...');
    const isDM = message.channel.isDMBased();
    const location = isDM
        ? 'DM'
        : `${message.guild?.name} -> ${message.channel.id}`;

    console.log(
        `\n`,
        `\n`,
        `[===============================================================]\n`,
        `\n`,
        `[ Log: interaction ] > At: ${currentTime}\n`,
        `   Interaction: ${isDM ? 'DM' : 'mention'}\n`,
        `   Author: ${message.author.globalName}\n`,
        `   Location: ${location}\n`,
        `   content: "${content}"\n`,
    );

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

    let chat;
    try {
        chat = await (client as any).gemini.chats.create({
            // model: 'gemini-2.5-flash-lite-preview-06-17',
            // model: 'gemini-2.5-pro',
            model: 'gemini-2.5-flash',
            config: {
                temperature: 1.5,
                maxOutputTokens: 499,
                systemInstruction: systemInstruction,
                thinkingConfig: {
                    thinkingBudget: 0, // Disables thinking
                },
            },
            history: history,
        });
    } catch (error) {
        console.log('At:', currentTime);
        console.error('Creating chat error:', error);
        console.log(history);
        replyMessage.edit(errorMessage);
        return;
    }

    let response;
    try {
        response = await chat.sendMessage({
            message: content,
        });
    } catch (error) {
        console.log('At:', currentTime);
        console.error('Chat.sendMessage error:', error);
        replyMessage.edit(errorMessage);
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

    console.log(
        `[ Log: response ] > At: ${currentTime}\n` +
            `   Text: ${responseText}\n` +
            `   Model Version: ${modelVersion}\n` +
            `   Usage Metadata:\n` +
            `${usageMetadata}\n` +
            `   Finish Reason: ${finishReason}\n`,
    );

    if (
        !response ||
        !response.text ||
        response.text.trim().length === 0 ||
        response.text.trim().length >= 2000 ||
        response.candidates?.[0]?.finishReason === 'MAX_TOKENS'
    ) {
        replyMessage.edit(errorMessage);
        console.log(
            'Response length:',
            response.text ? response.text.length : 'undefined',
        );
        return;
    }

    const finalResponse = substituteNamesWithMentions(
        response.text,
        message.mentions.users,
    );

    replyMessage.edit(finalResponse);

    return;
}
