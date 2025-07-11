export function newMentionLog(currentTime, authorName, content, isDM, location) {
    console.log(`[ Log: mention ] > At: ${currentTime}\n`, `   Interaction: ${isDM ? 'DM' : 'mention'}\n`, `   Author: ${authorName}\n`, `   Location: ${location}\n`, `   content: "${content}"\n`);
}
export function newResponseLog(currentTime, responseText, modelVersion, usageMetadata, finishReason) {
    console.log(`[ Log: response ] > At: ${currentTime}\n` +
        `   Text: ${responseText}\n` +
        `   Model Version: ${modelVersion}\n` +
        `   Usage Metadata:\n` +
        `${usageMetadata}\n` +
        `   Finish Reason: ${finishReason}\n`);
}
export function newReplyLengthErrorLog(currentTime, replyLength, isDM) {
    console.log(`[ Log: reply length error ] > At: ${currentTime}\n` +
        `   Reply Length: ${replyLength} characters\n` +
        `   Is DM: ${isDM}\n`, `   Note: Reply length exceeds the maximum allowed length.\n`);
}
export function newCreateChatErrorLog(currentTime, error, history) {
    console.log(`[ Log: create chat error ] > At: ${currentTime}\n` +
        `   History Length: ${history.length}\n` +
        `   History: ${JSON.stringify(history, null, 2)}\n`, `   > Error: `);
    console.error(error);
}
export function newSendMessageErrorLog(time, error, content, history) {
    console.log(`[ Log: send message error ] > At: ${time}\n` +
        `   Content: "${content}"\n` +
        `   History Length: ${history.length}\n` +
        `   History: ${JSON.stringify(history, null, 2)}\n`, `   > Error: `);
    console.error(error);
}
