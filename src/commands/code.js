const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenAI, Modality } = require("@google/genai");
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('code')
        .setDescription('Code-related assistance.'),
    async execute(interaction, Gemini) {
        await interaction.deferReply('working....');
    //     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    //     const contents =
    //         "Hi, can you create a 3d rendered image of a pig " +
    //         "with wings and a top hat flying over a happy " +
    //         "futuristic scifi city with lots of greenery?";

    //     try {
    //         const response = await ai.models.generateContent({
    //             model: "gemini-2.0-flash-exp-image-generation",
    //             contents: contents,
    //             config: {
    //                 responseModalities: [Modality.TEXT, Modality.IMAGE],
    //             },
    //         });

    //         let replyText = '';
    //         for (const part of response.candidates[0].content.parts) {
    //             if (part.text) {
    //                 replyText += part.text + '\n';
    //             } else if (part.inlineData) {
    //                 const imageData = part.inlineData.data;
    //                 const buffer = Buffer.from(imageData, "base64");
    //                 const imagePath = "gemini-native-image.png";
    //                 fs.writeFileSync(imagePath, buffer);
    //                 replyText += `Image saved as ${imagePath}\n`;
    //             }
    //         }

    //         await interaction.editReply(replyText || "Response generated successfully.");
    //     } catch (error) {
    //         console.error(error);
    //         await interaction.editReply("An error occurred while generating the content.");
    //     }
     }
};
