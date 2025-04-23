const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenAI } = require('@google/genai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('code')
        .setDescription('Generate code based on your prompt')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Describe what kind of code you need')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.reply({ content: 'Generating code...', withReply: true });

        const contextInstructions = [
            "YOUR ROLE: You are a code generator bot for Discord.",
            "Your name is Gemini.",
            "You use the Gemini 2.0 Flash API.",
            "Respond only with code unless context requires clarification.",
            "Use comments inside code if you need to explain something.",
            "Always respond in English, regardless of the prompt's language.",
            `User to respond: ${interaction.user.username}`,
            "Do not use Markdown formatting.",
            "Maintain a formal and neutral tone unless otherwise requested.",
        ];

        try {
            const prompt = interaction.options.getString('prompt');
            const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

            const responseStream = await gemini.models.generateContentStream({
                model: 'gemini-2.0-flash',
                contents: prompt,
                config: {
                    temperature: 1.5,
                    maxOutputTokens: 512,
                    systemInstruction: contextInstructions,
                },
            });

            let result = '';
            for await (const chunk of responseStream) {
                if (chunk.text) {
                    result += chunk.text;
                    if (result.length > 1995) {
                        result = result.slice(0, 1995) + '...';
                        break;
                    }
                    await interaction.editReply(result);
                }
            }

        } catch (error) {
            const currentTime = new Date().toLocaleTimeString();
            console.error(`Error at ${currentTime}:`, error);
            await interaction.editReply('Oops! Something went wrong while generating your code.');
        }
    },
};
