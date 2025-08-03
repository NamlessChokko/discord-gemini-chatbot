import {
    GoogleGenAI,
    Chat,
    GenerateContentResponse,
    Content,
    Part,
} from '@google/genai';
import { MessageData, GenerationConfig } from '../types.js';
import systemInstructions from './systemInstructions.js';

/**
 * Creates a new Google GenAI chat instance with specified configuration and history.
 * This function initializes a chat session with system instructions and conversation context.
 *
 * @param gemini - The GoogleGenAI client instance
 * @param history - Array of previous conversation messages for context
 * @param messageData - Structured data about the current Discord message
 * @param config - Generation configuration including model, temperature, and thinking budget
 * @returns A promise that resolves to a configured Chat instance
 *
 * @remarks
 * - System instructions are dynamically generated based on bot name, user, location, and time
 * - Temperature controls randomness in responses (0.0 = deterministic, 1.0 = creative)
 * - Thinking budget limits the model's internal reasoning steps
 * - History provides conversational context for more coherent responses
 *
 * @example
 * ```typescript
 * const chat = await createChat(geminiClient, conversationHistory, messageData, genConfig);
 * const response = await chat.sendMessage({ message: parts });
 * ```
 */
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

/**
 * Generates an AI response using an existing chat instance.
 * This function sends a message to the chat and returns the AI's response.
 *
 * @param chat - The Chat instance to send the message through
 * @param content - Array of Part objects containing the message content (text, images, etc.)
 * @returns A promise that resolves to the AI's response including text and usage metadata
 *
 * @remarks
 * - The chat maintains conversation context from its creation
 * - Content can include text, images, and other media types
 * - Response includes usage metadata for tracking token consumption
 * - May throw errors if the API request fails or content violates policies
 *
 * @throws Will throw an error if the API request fails or content is rejected
 *
 * @example
 * ```typescript
 * const parts = [{ text: "Hello, how are you?" }];
 * const response = await generateResponseWithChat(chat, parts);
 * console.log(response.text); // AI's text response
 * console.log(response.usageMetadata); // Token usage information
 * ```
 */
export async function generateResponseWithChat(
    chat: Chat,
    content: Part[],
): Promise<GenerateContentResponse> {
    return await chat.sendMessage({
        message: content,
    });
}
