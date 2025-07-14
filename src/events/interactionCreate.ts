import { Interaction } from 'discord.js';
import handleInteractions from '../lib/interaction-handlers.js';
import { GoogleGenAI } from '@google/genai';

export const name = 'interactionCreate';

export async function execute(interaction: Interaction, gemini: GoogleGenAI) {
    if (interaction.isChatInputCommand()) {
        handleInteractions.chatInputCommand(interaction, gemini);
    }
}
