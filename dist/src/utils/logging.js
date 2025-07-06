export function newInteractionLog(currentTime, authorName, content, isDM, location) {
    console.log(`[ Log: interaction ] > At: ${currentTime}\n`, `   Interaction: ${isDM ? 'DM' : 'mention'}\n`, `   Author: ${authorName}\n`, `   Location: ${location}\n`, `   content: "${content}"\n`);
}
export function newResponseLog(currentTime, responseText, modelVersion, usageMetadata, finishReason) {
    console.log(`[ Log: response ] > At: ${currentTime}\n` +
        `   Text: ${responseText}\n` +
        `   Model Version: ${modelVersion}\n` +
        `   Usage Metadata:\n` +
        `${usageMetadata}\n` +
        `   Finish Reason: ${finishReason}\n`);
}
