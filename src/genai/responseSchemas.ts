import { Type } from '@google/genai';

const responseSchemas = {
    code: {
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
