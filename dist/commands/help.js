import { SlashCommandBuilder } from 'discord.js';
import { newHelpCommandLog } from '../lib/logging.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});
const helpMessage = `
**🤖 Gemini Chat Bot Help**

**🗨️ How to Use**
- **Mention the bot**: Just mention "@Gemini - Chatbot" in any message and ask anything.
- **Direct Messages**: You can chat with the bot privately via DMs.
- **Slash Commands**: Use slash commands like "/code", "/imagine", and more (coming soon).


Use "${config.botInfo.customName}" or try a command to begin!
`;
export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays usage instructions and bot capabilities.');
export async function execute(interaction) {
    newHelpCommandLog(new Date().toLocaleString(), interaction.user.username, interaction.guild?.name || 'DM');
    await interaction.reply(helpMessage);
}
