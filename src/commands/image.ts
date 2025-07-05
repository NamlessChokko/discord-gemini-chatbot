import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { GoogleGenAI, Modality } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const data = new SlashCommandBuilder()
    .setName('image')
    .setDescription('Generate an image based on your prompt')
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
    await interaction.reply({
        content: 'Generating image...',
        fetchReply: true,
    });

    const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
                temperature: 2,
                maxOutputTokens: 1024,
            },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        let imageBuffer: Buffer | null = null;
        let caption = '';

        for (const part of parts) {
            if (part.inlineData?.data) {
                imageBuffer = Buffer.from(part.inlineData.data, 'base64');
            } else if (part.text) {
                caption += part.text + '\n';
            }
        }

        if (imageBuffer) {
            const imgPath = path.join(__dirname, 'out.png');
            fs.writeFileSync(imgPath, imageBuffer);
            await interaction.editReply({
                content: caption.trim() || 'Here’s your image:',
                files: [imgPath],
            });
            fs.unlinkSync(imgPath);
        } else {
            await interaction.editReply(
                'No image could be generated for that prompt.',
            );
        }
    } catch (error) {
        console.error('Error during Gemini image generation:', error);
        await interaction.editReply(
            'Sorry, I couldn’t generate that image right now.',
        );
    }
}
