import { Type } from '@google/genai';

/**
 * Response Schemas for Google GenAI Structured Output
 *
 * Response schemas define the expected structure and format of AI model responses.
 * They enable "structured generation" where the AI must return data in a specific JSON format
 * rather than free-form text. This is crucial for programmatic processing of AI responses.
 *
 * How Response Schemas Work:
 * - Define a JSON Schema that specifies the exact structure the AI should follow
 * - Include data types (STRING, OBJECT, ARRAY, etc.) for each field
 * - Provide descriptions to guide the AI on what content should go in each field
 * - Set required fields to ensure critical data is always present
 * - Use propertyOrdering to control the sequence of fields in the response
 *
 * Benefits:
 * - Guarantees parseable, structured responses instead of unpredictable text
 * - Enables reliable data extraction and processing in code
 * - Reduces errors from parsing free-form AI responses
 * - Allows for consistent UI rendering and data handling
 *
 * In this bot, schemas are used for commands like /code that need to return
 * structured data (code files with metadata) rather than plain text responses.
 */

const responseSchemas = {
    Code: {
        type: Type.ARRAY,
        description:
            'An array of code snippets, each representing a single file.',
        items: {
            type: Type.OBJECT,
            description:
                'Represents a single code snippet, along with its metadata.',
            properties: {
                deliveryMessage: {
                    type: Type.STRING,
                    description:
                        'A message to the user (e.g., "Here is your generated code:", "This is your code in python:", "C program using ncurses:").',
                },
                fileNameWithoutExtension: {
                    type: Type.STRING,
                    description:
                        'The name of the file without its extension (e.g., "myScript").',
                },
                rawCode: {
                    type: Type.STRING,
                    description: 'The raw code content of the file.',
                },
                languageExtension: {
                    type: Type.STRING,
                    description:
                        'The file extension indicating the programming language (e.g., "js", "py").',
                },
            },
            propertyOrdering: [
                'deliveryMessage',
                'fileNameWithoutExtension',
                'rawCode',
                'languageExtension',
            ],
            required: [
                'deliveryMessage',
                'fileNameWithoutExtension',
                'rawCode',
                'languageExtension',
            ],
        },
    },
};

export default responseSchemas;
