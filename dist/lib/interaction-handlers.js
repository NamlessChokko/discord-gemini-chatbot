export default {
    chatInputCommand: async (interaction, gemini) => {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            await command.execute(interaction, gemini);
        }
        catch (error) {
            console.error('interactionCreate error: ', error);
        }
    },
};
