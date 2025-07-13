import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const helpMessage = `
**🤖 Gemini Chat Bot Help**

Gemini is powered by Google's Gemini 2.5 Flash API, enabling natural conversations directly inside Discord.

**🗨️ How to Use**
- **Mention the bot**: Just mention "@Gemini - Chatbot" in any message and ask anything.
- **Direct Messages**: You can chat with Gemini privately via DMs.
- **Slash Commands**: Use slash commands like "/code", "/imagine", and more (coming soon).


Use "@Gemini - Chatbot" or try a command to begin!
`;

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays usage instructions and bot capabilities.');

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(helpMessage);
}
