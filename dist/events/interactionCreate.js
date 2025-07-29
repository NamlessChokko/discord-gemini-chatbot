import handleInteractions from '../lib/interaction-handlers.js';
export const name = 'interactionCreate';
export async function execute(interaction, gemini) {
    if (interaction.isChatInputCommand()) {
        handleInteractions.chatInputCommand(interaction, gemini);
    }
}
