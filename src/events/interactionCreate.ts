import { Interaction } from 'discord.js';

export const name = 'interactionCreate';
export async function execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const command = (interaction.client as any).commands.get(
        interaction.commandName,
    );

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`,
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('interactionCreate error: ', error);
    }
}
