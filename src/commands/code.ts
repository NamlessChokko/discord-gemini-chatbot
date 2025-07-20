import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { newCodeCommandLog } from '../lib/logging.js';
import systemInstructions from '../lib/systemInstructions.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});

export const data = new SlashCommandBuilder()
    .setName('code')
    .setDescription('Generate code based on your prompt')
    .addStringOption((option) =>
        option
            .setName('prompt')
            .setDescription('Describe what kind of code you need')
            .setRequired(true),
    );

export async function execute(
    interaction: ChatInputCommandInteraction,
    gemini: GoogleGenAI,
) {
    const prompt = interaction.options.getString('prompt');
    if (!prompt) {
        return;
    }

    newCodeCommandLog(
        new Date().toLocaleString(),
        interaction.user.username,
        prompt,
        interaction.guild?.name || 'Direct Message',
    );

    await interaction.reply({
        content: config.code.proccessingMessage,
        withResponse: true,
    });

    const systemInstruction = systemInstructions.code(
        interaction.user.globalName ||
            interaction.user.username ||
            'Uknown User',
    );

    let response: GenerateContentResponse | null = null;
    try {
        response = await gemini.models.generateContent({
            model: config.code.generation.model,
            contents: prompt,
            config: {
                temperature: config.code.generation.temperature,
                systemInstruction: systemInstruction,
                responseMimeType: 'text/plain',
            },
        });
    } catch (error) {
        await interaction.editReply(config.code.errorMessage);
        const currentTime = new Date().toLocaleTimeString();
        console.error(`Error at ${currentTime}:`, error);
    }

    const parts = response?.candidates?.[0]?.content?.parts || [];

    interaction.editReply({
        content: config.code.successMessage,
        files: [
            {
                attachment: Buffer.from(
                    parts.map((part) => part.text).join(''),
                    'utf-8',
                ),
                name: 'generated_code.txt',
            },
        ],
    });
}
