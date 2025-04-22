const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check bot latency and API response time.'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

		const latency = sent.createdTimestamp - interaction.createdTimestamp;
		const apiPing = interaction.client.ws.ping;

		await interaction.editReply(`🏓 Pong!\n- Response Time: **${latency}ms**\n- API Latency: **${apiPing}ms**`);
	},
};
