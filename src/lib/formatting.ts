import { GenerateContentResponseUsageMetadata } from '@google/genai';

export function formatUsageMetadata(
    usageMetadata: GenerateContentResponseUsageMetadata | null | undefined,
): string {
    if (!usageMetadata) {
        return '(no usage metadata)';
    }

    const responseFormated = JSON.stringify(usageMetadata, null, 2)
        .split('\n')
        .map((line) => `   ${line}`)
        .join('\n');
    return responseFormated;
}
