import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency and API response time.');
export async function execute(interaction) {
    const sent = await interaction.reply({
        content: 'Pinging...',
        withResponse: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;

    await interaction.editReply(
        `🏓 Pong!\n- Response Time: **${latency}ms**\n- API Latency: **${apiPing}ms`,
    );
}

