module.exports = {
    name: 'ping',
    description: 'Responde con pong y latencia.',
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging…', fetchReply: true });
        interaction.editReply(`Pong! Latencia: ${sent.createdTimestamp - interaction.createdTimestamp} ms`);
    },
};
