module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const currentTime = new Date().toLocaleTimeString();
        const authorName = message.author.globalName;
        const content = message.content.replace(`<@${client.user.id}>`, '').trim();

        const systemInstructions = [
            "YOUR ROLE: You are a discord chatbot",
            "You are called Gemini",
            "You use Gemini 2.0 flash API.",
            "Your responses should be as neutral and informative as possible but if you detect a joking tone in a message, you can answer with a funny tone",
            "Some users will prompt in other languages, but you have to answer always in english",
            "If a user start its prompt with 'DEBUG' or 'DEV' you have to send exactly what the user is asking you. No jokes, just the petition.",
            "LIMITATION: Your messages have to be less than 2000 chars long because of the discord limits.",
            `EXTRA INFORMATION: Current time is: ${currentTime}`,
            `User to respond: ${authorName}`
        ];

        const generateResponse = async () => {
            return await client.gemini.models.generateContent({
                model: "gemini-2.0-flash",
                contents: message.content,
                config: {
                    temperature: 2.0,
                    maxOutputTokens: 499,
                    systemInstruction: systemInstructions,
                },
            });
        };

        try {
            if (message.channel.type === 1) {
                const response = await generateResponse();
                console.log('New DM interaction at:', currentTime, '\nMessage content:', content);
                return message.reply(response.text);
            }

            if (message.mentions.has(client.user)) {
                if (content.length === 0) return message.reply('Did you call me? Use `!help` for more information!');
                const response = await generateResponse();
                console.log('New interaction in', message.guild.name, '-', message.channel.name, 'at:', currentTime, '\nMessage content:', content, 'by', authorName);
                return message.reply(response.text);
            }

        } catch (error) {
            console.log('At:', currentTime);
            console.error('Error during Gemini interaction:', error);
            return message.reply('Sorry, I can\'t talk right now...');
        }
    },
};
