const { Client } = require('discord.js');

function ping(client) {
    client.on('messageCreate', async (message) => {
        try {
            if (message.author.bot) return;

            if (message.content.toLowerCase() === 'g ping') {
                message.reply('Pong');
                console.log('The word "ping" was read correctly');
            }
        } catch (error) {
            console.error('Error handling "ping" command:', error);
            await message.channel.send('Something went wrong... :(');
        }
    });
}

module.exports = ping;