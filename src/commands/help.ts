import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { newHelpCommandLog } from '../lib/logging.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});

const helpMessage = `
**🤖 ${config.botInfo.customName} Help**

**🗨️ How to Use**
- **Mention the bot**: Just mention ${config.botInfo.customName} in any message and ask anything.
- **Direct Messages**: You can chat with the bot privately via DMs.
- **Slash Commands**: Use slash commands like "/code", "/imagine", and more (coming soon).
- **Memory**: The bot will remember all chain of messages replies.


Use @${config.botInfo.customName} or try a command to begin!
`;

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays usage instructions and bot capabilities.');

export async function execute(interaction: ChatInputCommandInteraction) {
    newHelpCommandLog({
        currentTime: new Date().toLocaleString(),
        authorName: interaction.user.username,
        location: interaction.guild?.name || 'DM',
    });
    await interaction.reply(helpMessage);
}
