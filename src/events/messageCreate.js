module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) {
            return;
        }
        if (!message.content || message.content.trim().length === 0) {
            return;
        }
        if (message.voiceMessage) {
            return;
        }

        const currentTime = new Date().toLocaleTimeString();
        const authorName = message.author.globalName;
        const content = message.content
            .replace(`<@${client.user.id}>`, '')
            .trim();

        const systemInstruction = [
            'YOUR ROLE: You are a discord chatbot',
            'You are called Gemini',
            'You use Gemini 2.0 flash API',
            'Your responses should be as neutral and informative as possible but if you detect a joking tone in a message, you can answer with a funny tone',
            'Some users will prompt in other languages, but you have to answer always in english',
            "If a user start its prompt with 'DEV' you have to send exactly what the user is asking you. No jokes, just the petition.",
            'LIMITATION: Your messages have to be less than 2000 chars long because of the discord limits.',
            `EXTRA INFORMATION: Current time is: ${currentTime}`,
            `User to respond: ${authorName}`,
        ];

        try {
            if (
                message.channel.type === 1 ||
                message.mentions.has(client.user)
            ) {
                const replyMessage = await message.reply('Thinking...');
                console.log(
                    `New ${message.channel.type === 1 ? 'DM' : 'mention'} interaction at: ${currentTime}`,
                    '\nMessage content:',
                    content,
                );

                const history = [];
                let cursor = message;

                while (cursor.reference) {
                    const parent = await message.channel.messages.fetch(
                        cursor.reference.messageId,
                    );
                    const role =
                        parent.author.id === client.user.id ? 'model' : 'user';
                    history.unshift({
                        role,
                        parts: [{ text: parent.content }],
                    });
                    cursor = parent;
                }

                let chat;
                try {
                    chat = await client.gemini.chats.create({
                        model: 'gemini-2.0-flash',
                        config: {
                            temperature: 1.5,
                            maxOutputTokens: 499,
                            systemInstruction: systemInstruction,
                        },
                        history: history,
                    });
                } catch (error) {
                    console.log('At:', currentTime);
                    console.error('Creating chat error:', error);
                    console.log(history);
                    replyMessage.edit("Sorry, I can't talk right now...");
                    return;
                }

                let response;
                try {
                    response = await chat.sendMessageStream({
                        message: content,
                    });
                } catch (error) {
                    console.log('At:', currentTime);
                    console.error('Chat.sendMessage error:', error);
                    replyMessage.edit("Sorry, I can't talk right now...");
                    return;
                }

                let fullResponse = '';
                for await (const chunk of response) {
                    if (chunk.text) {
                        fullResponse += chunk.text;
                        if (fullResponse.length > 1995) {
                            replyMessage.edit(
                                'Sorry, the message is too long...',
                            );
                            break;
                        }
                        await replyMessage.edit(fullResponse);
                    }
                }

                return;
            }
        } catch (error) {
            console.log('At:', currentTime);
            console.error(
                'Error during Gemini messageCreate interaction:',
                error,
            );
            message.editReply("Sorry, I can't talk right now...");
            return;
        }
    },
};
