module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
   if (!message.content || message.content.trim().length === 0) return;
   if (message.voiceMessage) return;
        const currentTime = new Date().toLocaleTimeString();
        const authorName = message.author.globalName;
        const content = message.content.replace(`<@${client.user.id}>`, '').trim();

        const systemInstructions = [
            "YOUR ROLE: You are a discord chatbot",
            "You are called Gemini",
            "You use Gemini 2.0 flash API",
            "Your responses should be as neutral and informative as possible but if you detect a joking tone in a message, you can answer with a funny tone",
            "Some users will prompt in other languages, but you have to answer always in english",
            "If a user start its prompt with 'DEV' you have to send exactly what the user is asking you. No jokes, just the petition.",
            "LIMITATION: Your messages have to be less than 2000 chars long because of the discord limits.",
            `EXTRA INFORMATION: Current time is: ${currentTime}`,
            `User to respond: ${authorName}`,
            "DO NOT REPLY TO MEDIA IF THE USERS DONT MENTIONS U"

        ];

        if(message.mentions.has(client.user)) {
            message.reply(`Hello! I am Gemini, your friendly AI assistant. How can I help you today?`);
            message.react('👋');
         }

        try {
            if (message.channel.type === 1 || message.mentions.has(client.user)) {
                const replyMessage = await message.reply('Thinking...');
                console.log(
                    `New ${message.channel.type === 1 ? 'DM' : 'mention'} interaction at: ${currentTime}`,
                    '\nMessage content:', content
                );

                const response = await client.gemini.models.generateContentStream({
                    model: "gemini-2.0-flash",
                    contents: message.content,
                    config: {
                        temperature: 2.0,
                        maxOutputTokens: 499,
                        systemInstruction: systemInstructions,
                    },
                });

                let fullResponse = '';
                for await (const chunk of response) {
                    if (chunk.text) {
                        fullResponse += chunk.text;
                        if (fullResponse.length > 1995) {
                            replyMessage.edit('Sorry, the message is too long...');
                            break;
                        }
                        await replyMessage.edit(fullResponse);
                    }
                }

                return;
            }
        } catch (error) {
            console.log('At:', currentTime);
            console.error('Error during Gemini interaction:', error);
            return message.reply('Sorry, I can\'t talk right now...');
        }
    },
};
