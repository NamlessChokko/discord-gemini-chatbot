import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { GoogleGenAI, Modality } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { newImagineCommandLog } from '../lib/logging.js';
import { fileURLToPath } from 'url';
const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const helpMessage = `**/imagine** - Generate an image based on your prompt. Use this command to create images from text descriptions.`;

export const data = new SlashCommandBuilder()
    .setName('imagine')
    .setDescription('Generate an imagine based on your prompt')
    .addStringOption((opt) =>
        opt
            .setName('prompt')
            .setDescription('Describe the image you want to generate')
            .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const prompt = interaction.options.getString('prompt');
    if (!prompt) {
        await interaction.editReply('Prompt cannot be empty.');
        return;
    }

    newImagineCommandLog(
        new Date().toLocaleString(),
        interaction.user.username,
        prompt,
        interaction.guild?.name || 'Direct Message',
    );

    await interaction.reply({
        content: 'Generating image...',
        withResponse: true,
    });

    const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
        const response = await gemini.models.generateContent({
            model: config.imagine.generation.model,
            contents: prompt,
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
                temperature: config.imagine.generation.temperature,
            },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        let imageBuffer: Buffer | null = null;

        for (const part of parts) {
            if (part.inlineData?.data) {
                imageBuffer = Buffer.from(part.inlineData.data, 'base64');
            }
        }

        if (imageBuffer) {
            const imgPath = path.join(__dirname, 'out.png');
            fs.writeFileSync(imgPath, imageBuffer);
            await interaction.editReply({
                content: 'Here’s your image:',
                files: [imgPath],
            });
            fs.unlinkSync(imgPath);
        } else {
            await interaction.editReply(config.imagine.errorMessage);
        }
    } catch (error) {
        console.error('Error during Gemini image generation:', error);
        await interaction.editReply(config.imagine.errorMessage);
    }
}
