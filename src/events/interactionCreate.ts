import { Interaction } from 'discord.js';
import handleInteractions from '../lib/interaction-handlers.js';

export const name = 'interactionCreate';

export async function execute(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
        handleInteractions.chatInputCommand(interaction);
    }
}
