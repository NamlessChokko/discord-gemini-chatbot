import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { newPingCommandLog } from '../lib/logging.js';

export const helpMessage = `**/ping** - Check the bot's latency and API response time. Use this command to ensure the bot is responsive and functioning correctly.`;

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency and API response time.');
export async function execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({
        content: 'Pinging...',
        withResponse: true,
    });

    const latency =
        sent.interaction.createdTimestamp - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;

    newPingCommandLog(
        new Date().toLocaleString(),
        interaction.user.username,
        latency,
        apiPing,
        interaction.guild?.name || 'DM',
    );

    await interaction.editReply(
        `🏓 Pong!\n- Response Time: **${latency}ms**\n- API Latency: **${apiPing}ms**`,
    );
}
