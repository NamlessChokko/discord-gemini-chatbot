import {
    GoogleGenAI,
    Chat,
    GenerateContentResponse,
    Content,
    Part,
    Modality,
    Schema,
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
                config.botName || 'Unknown Bot',
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

/**
 * Generates an image using Google GenAI based on a text prompt.
 * This function uses the Gemini model to create visual content from textual descriptions.
 *
 * @param gemini - The GoogleGenAI client instance
 * @param prompt - Text description of the image to generate
 * @param config - Generation configuration including model and temperature settings
 * @returns A promise that resolves to the generated content response containing image and text
 *
 * @remarks
 * - Uses IMAGE and TEXT response modalities to generate both visual and textual content
 * - Temperature controls the creativity level of the generated image (0.0 = conservative, 1.0 = creative)
 * - The model specified in config determines the quality and capabilities of image generation
 * - Response may include both the generated image and descriptive text about the image
 *
 * @throws Will throw an error if the API request fails, prompt violates content policies, or model doesn't support image generation
 *
 * @example
 * ```typescript
 * const imageResponse = await generateImage(geminiClient, "A sunset over mountains", genConfig);
 * // Access generated image and accompanying text from imageResponse
 * ```
 */
export async function generateImage(
    gemini: GoogleGenAI,
    prompt: string,
    config: GenerationConfig,
): Promise<GenerateContentResponse> {
    return await gemini.models.generateContent({
        model: config.model,
        contents: prompt,
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
            temperature: config.temperature,
        },
    });
}

/**
 * Generates structured content using Google GenAI with a predefined JSON schema.
 * This function forces the AI to respond in a specific JSON format defined by the provided schema.
 *
 * @param gemini - The GoogleGenAI client instance
 * @param prompt - Text prompt describing what content to generate
 * @param schema - JSON schema that defines the structure of the expected response (More information in https://ai.google.dev/gemini-api/docs/structured-output)
 * @param config - Generation configuration including model and temperature settings
 * @returns A promise that resolves to the generated content response in JSON format
 *
 * @remarks
 * - Uses specialized system instructions for code generation contexts
 * - Forces JSON response format using 'application/json' MIME type
 * - The schema parameter constrains the AI's output to match the specified structure
 * - Temperature controls randomness while maintaining schema compliance
 * - Useful for generating structured data like code snippets, configurations, or formatted responses
 *
 * @throws Will throw an error if the API request fails, schema is invalid, or generated content doesn't match the schema
 *
 * @example
 * ```typescript
 * const codeSchema = { type: "object", properties: { language: { type: "string" }, code: { type: "string" } } };
 * const response = await generateContentWithSchema(geminiClient, "Generate a Hello World in Python", codeSchema, genConfig);
 * // Response will be structured JSON matching the schema
 * ```
 */
export async function generateContentWithSchema(
    gemini: GoogleGenAI,
    prompt: string,
    schema: Schema,
    config: GenerationConfig,
): Promise<GenerateContentResponse> {
    return await gemini.models.generateContent({
        model: config.model,
        contents: prompt,
        config: {
            temperature: config.temperature,
            systemInstruction: systemInstructions.code(),
            responseMimeType: 'application/json',
            responseSchema: schema,
        },
    });
}
