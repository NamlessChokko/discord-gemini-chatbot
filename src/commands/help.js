import { SlashCommandBuilder } from 'discord.js';
const helpMessage = `
**🤖 Gemini Chat Bot Help**

Gemini is powered by Google's Gemini 2.5 Flash API, enabling natural conversations directly inside Discord.

**🗨️ How to Use**
- **Mention the bot**: Just mention "@Gemini" in any message and ask anything.
- **Direct Messages**: You can chat with Gemini privately via DMs.
- **Slash Commands**: Use slash commands like " /
    code", " /
    image", and more (coming soon).

**📏 Limits**
- Max response size: ~2000 characters.
- Gemini API max tokens per response: **499 tokens**.

**⚙️ Notes**
- Answers are always in **English** regardless of the input.
- If you joke, Gemini might joke back 😉

Use "@Gemini" or try a command to begin!
`;
export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays usage instructions and bot capabilities.');
export async function execute(interaction) {
    await interaction.reply(helpMessage);
}

