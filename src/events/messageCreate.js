module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return; // No bots can call Gemini

        // DM
        if (message.channel.type === 1) { // DM = 1
            try {
                // const model = client.gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
                // const result = await model.generateContent(message.content);

                const response = await client.gemini.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: message.content,
                });
            
                return message.channel.send(response.text);
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
            if (content.length === 0) return message.reply('Did you call me? Use `!help` if you need anything');

            try {
                // const model = client.gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
                // const result = await model.generateContent(content);

                
                const response = await client.gemini.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: message.content,
                });
            
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
