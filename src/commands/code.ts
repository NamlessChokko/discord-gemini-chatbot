import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { newCodeCommandLog } from '../lib/logging.js';
import systemInstructions from '../lib/genai/systemInstructions.js';
import responseSchemas from '../lib/genai/responseSchemas.js';
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

    newCodeCommandLog({
        currentTime: new Date().toLocaleString(),
        authorName: interaction.user.username,
        prompt: prompt,
        location: interaction.guild?.name || 'Direct Message',
    });

    await interaction.reply({
        content: config.code.proccessingMessage,
        withResponse: true,
    });

    const systemInstruction = systemInstructions.code();

    let response: GenerateContentResponse | null = null;
    try {
        response = await gemini.models.generateContent({
            model: config.code.generation.model,
            contents: prompt,
            config: {
                temperature: config.code.generation.temperature,
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: responseSchemas.Code,
            },
        });
    } catch (error) {
        await interaction.editReply(config.code.errorMessage);
        const currentTime = new Date().toLocaleTimeString();
        console.error(`Error at ${currentTime}:`, error);
    }

    const codeJSON = response?.candidates?.[0]?.content?.parts?.[0].text || '';

    const codeData = JSON.parse(codeJSON);
    interaction.editReply({
        content: codeData[0].deliveryMessage,
        files: codeData.map(
            (file: {
                rawCode: string;
                fileNameWithoutExtension: string;
                languageExtension: string;
            }) => ({
                attachment: Buffer.from(file.rawCode, 'utf-8'),
                name: `${file.fileNameWithoutExtension}.${file.languageExtension}`,
            }),
        ),
    });
}
