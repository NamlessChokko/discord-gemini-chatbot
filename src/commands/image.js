const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenAI, Modality } = require('@google/genai');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Generate an image based on your prompt')
        .addStringOption((opt) =>
            opt
                .setName('prompt')
                .setDescription('Describe the image you want to generate')
                .setRequired(true),
        ),

    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        await interaction.reply({
            content: 'Generating image...',
            withReply: true,
        });

        const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        try {
            const response = await gemini.models.generateContent({
                model: 'gemini-2.0-flash-exp',
                contents: prompt,
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                    temperature: 2,
                    maxOutputTokens: 1024,
                },
            });

            const parts = response.candidates?.[0]?.content?.parts || [];
            let imageBuffer = null;
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
    },
};
