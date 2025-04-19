module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
    if (message.author.bot) return;
    if (message.channel.type === 'DM') {
        const reply = await client.gemini.generateContentAsync(message.content);
        return message.channel.send(reply);
    }
    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;
    const [cmdName, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
    if (cmdName === 'faku') {
        return message.channel.send('Fak u too');
        }
    },
};
