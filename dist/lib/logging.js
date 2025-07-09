export function newMentionLog(currentTime, authorName, content, isDM, location) {
    console.log("[ Log: mention ] > At: ".concat(currentTime, "\n"), "   Interaction: ".concat(isDM ? 'DM' : 'mention', "\n"), "   Author: ".concat(authorName, "\n"), "   Location: ".concat(location, "\n"), '   content: "'.concat(content, '"\n'));
}
export function newResponseLog(currentTime, responseText, modelVersion, usageMetadata, finishReason) {
    console.log("[ Log: response ] > At: ".concat(currentTime, "\n") + "   Text: ".concat(responseText, "\n") + "   Model Version: ".concat(modelVersion, "\n") + "   Usage Metadata:\n" + "".concat(usageMetadata, "\n") + "   Finish Reason: ".concat(finishReason, "\n"));
}
export function newReplyLengthErrorLog(currentTime, replyLength, isDM) {
    console.log("[ Log: reply length error ] > At: ".concat(currentTime, "\n") + "   Reply Length: ".concat(replyLength, " characters\n") + "   Is DM: ".concat(isDM, "\n"), "   Note: Reply length exceeds the maximum allowed length.\n");
}
export function newCreateChatErrorLog(currentTime, error, history) {
    console.log("[ Log: create chat error ] > At: ".concat(currentTime, "\n") + "   History Length: ".concat(history.length, "\n") + "   History: ".concat(JSON.stringify(history, null, 2), "\n"));
    console.error(error);
}
export function newSendMessageErrorLog(time, error, content, history) {
    console.log("[ Log: send message error ] > At: ".concat(time, "\n") + '   Content: "'.concat(content, '"\n') + "   History Length: ".concat(history.length, "\n") + "   History: ".concat(JSON.stringify(history, null, 2), "\n"));
    console.error(error);
}
