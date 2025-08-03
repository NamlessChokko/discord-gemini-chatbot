import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
import { generateImage } from '../lib/genai/services.js';
import { newImagineCommandLog } from '../lib/logging.js';
import { imageFromParts } from '../lib/dataTransformation.js';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});

export const data = new SlashCommandBuilder()
    .setName('imagine')
    .setDescription('Generate an imagine based on your prompt')
    .addStringOption((opt) =>
        opt
            .setName('prompt')
            .setDescription('Describe the image you want to generate')
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

    newImagineCommandLog({
        currentTime: new Date().toLocaleString(),
        authorName: interaction.user.username,
        prompt: prompt,
        location: interaction.guild?.name || 'Direct Message',
    });

    await interaction.reply({
        content: 'Generating image...',
        withResponse: true,
    });

    try {
        const response = await generateImage(gemini, prompt, {
            model: config.imagine.generation.model as string,
            temperature: config.imagine.generation.temperature,
        });
        const parts = response.candidates?.[0]?.content?.parts || [];
        const imagePath = imageFromParts(parts);

        await interaction.editReply({
            content: parts[0].text,
            files: [imagePath],
        });
    } catch (error) {
        console.error('Error during Gemini image generation:', error);
        await interaction.editReply(config.imagine.errorMessage);
    }
}
