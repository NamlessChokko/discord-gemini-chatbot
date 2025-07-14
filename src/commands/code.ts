import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { newCodeCommandLog } from '../lib/logging.js';
import systemInstructions from '../lib/systemInstructions.js';

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
        content: 'Generating code...',
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
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 1.5,
                systemInstruction: systemInstruction,
            },
        });
    } catch (error) {
        const currentTime = new Date().toLocaleTimeString();
        console.error(`Error at ${currentTime}:`, error);
        await interaction.editReply(
            'Oops! Something went wrong while generating your code.',
        );
    }

    const parts = response?.candidates?.[0]?.content?.parts || [];

    interaction.editReply({
        content: 'Here’s your generated code:',
        files: [
            {
                attachment: Buffer.from(
                    parts.map((part) => part.text).join(''),
                    'utf-8',
                ),
                name: 'generated_code.js',
            },
        ],
    });
}
