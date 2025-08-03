import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { newPingCommandLog } from '../lib/logging.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency and API response time.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({
        content: 'Pinging...',
        fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;

    newPingCommandLog({
        currentTime: new Date().toLocaleString(),
        authorName: interaction.user.username,
        latency: latency,
        apiPing: apiPing,
        location: interaction.guild?.name || 'Direct Message',
    });

    await interaction.editReply(
        `🏓 Pong!\n- Response Time: **${latency}ms**\n- API Latency: **${apiPing}ms**`,
    );
}
