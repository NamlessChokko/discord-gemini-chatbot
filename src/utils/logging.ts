export function newInteractionLog(
    currentTime: string,
    authorName: string,
    content: string,
    isDM: boolean,
    location: string,
) {
    console.log(
        `[ Log: interaction ] > At: ${currentTime}\n`,
        `   Interaction: ${isDM ? 'DM' : 'mention'}\n`,
        `   Author: ${authorName}\n`,
        `   Location: ${location}\n`,
        `   content: "${content}"\n`,
    );
}

export function newResponseLog(
    currentTime: string,
    responseText: string,
    modelVersion: string,
    usageMetadata: string,
    finishReason: string,
) {
    console.log(
        `[ Log: response ] > At: ${currentTime}\n` +
            `   Text: ${responseText}\n` +
            `   Model Version: ${modelVersion}\n` +
            `   Usage Metadata:\n` +
            `${usageMetadata}\n` +
            `   Finish Reason: ${finishReason}\n`,
    );
}
