import { substituteMentionUsernames, substituteNamesWithMentions, } from '../utils/utils.js';
export const name = 'messageCreate';
export async function execute(message, client) {
    console.log('debug: messageCreate event triggered');
    if (!message.channel.isDMBased() &&
        !message.mentions.has(client.user)) {
        return;
    }
    if (message.mentions.everyone) {
        return;
    }
    if (message.author.tag === client.tag) {
        return;
    }
    if (!message.content) {
        return;
    }
    const errorMessage = 'Sorry, there was an error while processing your message. Please try again later.';
    const currentTime = new Date().toLocaleTimeString();
    const authorName = message.author.globalName;
    const content = substituteMentionUsernames(message.content, message.mentions.users);
    const systemInstruction = [
        'YOUR ROLE: You are a discord chatbot',
        'You are called Gemini Chatbot',
        'You use Gemini 2.5 API',
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
    console.log(`
            New ${isDM ? 'DM' : 'mention'} interaction at: ${currentTime}
            By ${message.author.globalName}
            In ${location}
            Message content: "${content}"
            `.trim());
    const history = [];
    let cursor = message;
    while (cursor.reference && cursor.reference.messageId) {
        const parent = await message.channel.messages.fetch(cursor.reference.messageId);
        const role = parent.author.id === client.user?.id ? 'model' : 'user';
        history.unshift({
            role,
            parts: [{ text: parent.content }],
        });
        cursor = parent;
    }
    let chat;
    try {
        chat = await client.gemini.chats.create({
            model: 'gemini-2.5-flash-lite-preview-06-17',
            // model: 'gemini-2.5-pro',
            // model: 'gemini-2.5-flash',
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.log('At:', currentTime);
        console.error('Chat.sendMessage error:', error);
        replyMessage.edit(errorMessage);
        return;
    }
    if (!response ||
        !response.text ||
        response.text.trim().length === 0 ||
        response.text.trim().length >= 2000) {
        console.log('At:', currentTime);
        console.error('Response is empty or too long:', JSON.stringify(response, null, 2));
        console.log('Response length:', response.text ? response.text.length : 'undefined');
        replyMessage.edit(errorMessage);
        return;
    }
    const finalResponse = substituteNamesWithMentions(response.text, message.mentions.users);
    console.log('Response: ', JSON.stringify(response, null, 2));
    replyMessage.edit(finalResponse);
    return;
}
