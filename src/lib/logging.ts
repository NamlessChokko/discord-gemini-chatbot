import { Content } from '@google/genai';

export function newMentionLog(
    currentTime: string,
    authorName: string,
    content: string,
    isDM: boolean,
    location: string,
) {
    console.log(
        `[ Log: mention ] > At: ${currentTime}\n`,
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

export function newReplyLengthErrorLog(
    currentTime: string,
    replyLength: number,
    isDM: boolean,
) {
    console.log(
        `[ Log: reply length error ] > At: ${currentTime}\n` +
            `   Reply Length: ${replyLength} characters\n` +
            `   Is DM: ${isDM}\n`,
        `   Note: Reply length exceeds the maximum allowed length.\n`,
    );
}

export function newCreateChatErrorLog(
    currentTime: string,
    error: unknown,
    history: Content[],
) {
    console.log(
        `[ Log: create chat error ] > At: ${currentTime}\n` +
            `   History Length: ${history.length}\n` +
            `   History: ${JSON.stringify(history, null, 2)}\n`,
        `   > Error: `,
    );
    console.error(error);
}

export function newSendMessageErrorLog(
    time: string,
    error: unknown,
    content: string,
    history: Content[],
) {
    console.log(
        `[ Log: send message error ] > At: ${time}\n` +
            `   Content: "${content}"\n` +
            `   History Length: ${history.length}\n` +
            `   History: ${JSON.stringify(history, null, 2)}\n`,
        `   > Error: `,
    );
    console.error(error);
}
