import { CustomClient } from '../lib/types.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { GoogleGenAI } from '@google/genai';

export default {
    chatInputCommand: async (
        interaction: ChatInputCommandInteraction,
        gemini: GoogleGenAI,
    ) => {
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
            await command.execute(interaction, gemini);
        } catch (error) {
            console.error('interactionCreate error: ', error);
        }
    },
};
