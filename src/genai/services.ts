import {
    GoogleGenAI,
    Chat,
    GenerateContentResponse,
    Content,
    Part,
} from '@google/genai';
import { MessageData, GenerationConfig } from '../lib/types.js';
import systemInstructions from './systemInstructions.js';

export async function createChat(
    gemini: GoogleGenAI,
    history: Content[],
    messageData: MessageData,
    config: GenerationConfig,
): Promise<Chat> {
    return gemini.chats.create({
        model: config.model,
        config: {
            temperature: config.temperature,
            systemInstruction: systemInstructions.messageCreate(
                config.botName,
                messageData.author,
                messageData.location,
                messageData.currentTime,
            ),
            thinkingConfig: {
                thinkingBudget: config.thinkingBudget,
            },
        },
        history: history,
    });
}

export async function generateResponseWithChat(
    chat: Chat,
    content: Part[],
): Promise<GenerateContentResponse> {
    return await chat.sendMessage({
        message: content,
    });
}
