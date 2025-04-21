const {SlashCommandBuilder} = require('discord.js'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show information about how to use'),
	async execute(interaction) {
		await interaction.reply('This feature is under developing');
	},
};