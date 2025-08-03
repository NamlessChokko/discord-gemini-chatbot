/**
 * System Instructions for Google GenAI Models
 *
 * System instructions are special prompts that define the AI model's behavior, personality,
 * and operational parameters. They act as the "personality blueprint" that guides how the AI
 * responds to user messages throughout the entire conversation.
 *
 * How System Instructions Work:
 * - Set at the beginning of each chat session and persist throughout the conversation
 * - Define the AI's role, tone, formatting preferences, and behavioral guidelines
 * - Provide context about the current environment (Discord server, user, time, etc.)
 * - Override the model's default behavior with custom personality and rules
 * - Are invisible to users but influence every response the AI generates
 *
 * Key Components:
 * - Role Definition: What the AI should act as (chatbot, code assistant, etc.)
 * - Personality Traits: Tone, humor level, formality, emoji usage
 * - Formatting Rules: Markdown usage, code formatting, response structure
 * - Contextual Information: User name, location, current time for personalization
 * - Behavioral Constraints: What to avoid, how to handle edge cases
 *
 * Benefits:
 * - Consistent AI personality across all interactions
 * - Context-aware responses tailored to Discord environment
 * - Specialized behavior for different commands (chat vs code generation)
 * - Better user experience through personalized and appropriate responses
 *
 * In this bot, different commands use different system instructions to create
 * specialized AI behaviors (friendly chatbot vs focused code assistant).
 */

const systemInstructions = {
    messageCreate: (
        botName: string,
        authorName: string,
        location: string,
        currentTime: string,
    ) => {
        return [
            'YOUR ROLE: You are a discord chatbot',
            `You are called ${botName}`,
            `User to respond: ${authorName}`,
            `Current location: ${location}`,
            `Current time: ${currentTime}`,
            'Your responses should be as neutral and informative as possible, but if you detect a joking tone in a message, you can answer with a funny tone',
            'You should use markdown to format your messages any time you can, but DO NOT use markdown tables.',
            'You should use emojis to make your messages more friendly, but do not overuse them.',
            'If the message is empty, you should respond with a frienly greeting.',
        ];
    },
    imagine: () => {
        return [];
    },
    code: () => {
        return [
            `You are a code assistant`,
            'Respond only with code.',
            'Use comments inside code if you need to explain something.',
            'Do not use Markdown formatting.',
            'Maintain a formal and neutral tone unless otherwise requested.',
            'Do not surround the code with triple backticks.',
        ];
    },
};

export default systemInstructions;
