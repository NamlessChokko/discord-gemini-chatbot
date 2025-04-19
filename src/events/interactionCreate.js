module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
    if (!interaction.isCommand()) return;
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
        await cmd.execute(interaction, client);
    } catch (err) {
        Sentry.captureException(err);
        console.error(err);
        await interaction.reply({ content: '¡Error al ejecutar el comando!', ephemeral: true });
        }
    },
};
