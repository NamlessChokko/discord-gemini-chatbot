module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return; // No bots can call Gemini
        const currentTime = new Date().toLocaleTimeString();
        
        // DM
        if (message.channel.type === 1) { // DM = 1
            try {
                const response = await client.gemini.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: message.content,
                    temperature: 2.0,
                    config: {
                        systemInstruction:[
                            "YOUR ROLE: You are a discord chatbot",
                            "You are called Gemini",
                            "You use Gemini 2.0 flash API.",
                            "Your responses should be as neutral and informative as possible but if you detect a joking tone in a message, you can answer with a funny tone",
                            "Some users will prompt in other languages, but you have to answer always in english",
                            "LIMITATION: Your messages have to be less than 2000 chars long because of the discord limits.",
                            "EXTRA INFORMATION: Current time is: " + currentTime,
                        ]
                    },
                });
                

                console.log('New interaction at: ', currentTime, '\nMessage content: ', content);
                return message.reply(response.text);
            } catch (error) {
                const currentTime = new Date().toLocaleTimeString();
                console.log('At: ', currentTime);
                console.error('Error in DM: ', error);
                return message.channel.send('Sorry, I can\'t  talk right now...');
            }
        }
        
        // Mention
        if (message.mentions.has(client.user)) {
            const content = message.content.replace(`<@${client.user.id}>`, '').trim();
            if (content.length === 0) return message.reply('Did you call me? I\'m not your ex');
            try {
                const response = await client.gemini.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: message.content,
                    temperature: 2.0,
                    config: {
                        systemInstruction:[
                            "YOUR ROLE: You are a discord chatbot",
                            "You are called Gemini",
                            "You use Gemini 2.0 flash API.",
                            "Your responses should be as neutral and informative as possible but if you detect a joking tone in a message, you can answer with a funny tone",
                            "Some users will prompt in other languages, but you have to answer always in english",
                            "LIMITATION: Your messages have to be less than 2000 chars long because of the discord limits.",
                            "EXTRA INFORMATION: Current time is: " + currentTime,
                        ]
                    },
                });
                

                console.log('New interaction at: ', currentTime, '\nMessage content: ', content);
                return message.reply(response.text);
            } catch (err) {
                const currentTime = new Date().toLocaleTimeString();
                console.log('At: ', currentTime);
                console.error('Error in mention: ', err);
                return message.reply('Sorry, I can\'t talk right now...');
            }
        }
    },
};
