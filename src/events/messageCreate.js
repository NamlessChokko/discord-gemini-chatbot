module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
    if (message.author.bot) return;
      // Ejemplo: si alguien manda "hola bot" en DM
    if (message.channel.type === 'DM') {
        const respuesta = await client.gemini.generateContentAsync(message.content);
        return message.channel.send(respuesta);
    }
      // Comandos por prefijo (opcional)
    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;
    const [cmdName, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
    if (cmdName === 'faku') {
        return message.channel.send('Fak u too');
        }
    },
};
