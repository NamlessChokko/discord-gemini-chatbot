const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenAI } = require ("@google/genai")


module.exports = {
	data: new SlashCommandBuilder()
		.setName('code')
		.setDescription('Generate a code ')
        .addStringOption(option => (
			option.setName('prompt')
				.setDescription('What you want to code?')
				.setRequired(true)
		)),
        async execute(interaction) {
			await interaction.reply({content: 'Cooking...', withResponse: true})
			
			const systemInstructions = [
				"YOUR ROLE: You are a discord bot code generator AI",
				"You are called Gemini",
				"You use Gemini 2.0 flash API",
				"Users will ask you for codes",
				"You have to anser with code",
				"If you want to let know something to the user use comments in the code",
				"Some users will prompt in other languages, but you have to answer always in english",
				`User to respond: ${interaction.user.username}`,
				"Make sure to use markdown format",
				"Try to be as neutral and formal as possible in your code unless user ask you for specific behavior",
			];
			
			try {
				const prompt = interaction.options.getString('prompt')
				const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

				const generateResponse = async () => {
					return await gemini.models.generateContent({
						model: "gemini-2.0-flash",
						contents: prompt,
						config: {
							temperature: 2.0,
							maxOutputTokens: 499,
							systemInstruction: systemInstructions,
						},
					});
				};
				const response = await generateResponse();

				await interaction.editReply(response.text);
			}catch(error){
				const currentTime = new Date().toLocaleTimeString();
				console.log('At:', currentTime);
				console.error('Error during Gemini interaction:', error);
				await interaction.editReply('Sorry, I can\'t talk right now...');
			}

	},
};

