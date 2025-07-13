import { CustomClient } from './types.js';
import { ChatInputCommandInteraction } from 'discord.js';

export default {
    chatInputCommand: async (interaction: ChatInputCommandInteraction) => {
        const command = (interaction.client as CustomClient).commands!.get(
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
    },
};
