import { Content } from '@google/genai';
import { logToFile } from './utils.js';
import util from 'node:util';

export function newMentionLog(
    currentTime: string,
    authorName: string,
    content: string,
    location: string,
) {
    const logMessage =
        `[ Log: mention ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   content: "${content}"\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newResponseLog(
    currentTime: string,
    responseText: string,
    modelVersion: string,
    usageMetadata: string,
    finishReason: string,
) {
    const logMessage =
        `[ Log: response ] > At: ${currentTime}\n` +
        `   Text: ${responseText}\n` +
        `   Model Version: ${modelVersion}\n` +
        `   Usage Metadata:\n` +
        `${usageMetadata}\n` +
        `   Finish Reason: ${finishReason}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newCreateChatErrorLog(
    currentTime: string,
    error: unknown,
    history: Content[],
) {
    const logMessage =
        `[ Log: create chat error ] > At: ${currentTime}\n` +
        `   History Length: ${history.length}\n` +
        `   History: ${JSON.stringify(history, null, 2)}\n` +
        `   > Error: ${util.inspect(error)}`;
    console.error(logMessage);
    logToFile(logMessage);
}

export function newSendMessageErrorLog(
    time: string,
    error: unknown,
    content: string,
    history: Content[],
) {
    const logMessage =
        `[ Log: send message error ] > At: ${time}\n` +
        `   Content: "${content}"\n` +
        `   History Length: ${history.length}\n` +
        `   History: ${JSON.stringify(history, null, 2)}\n` +
        `   > Error: ${util.inspect(error)}`;
    console.error(logMessage);
    logToFile(logMessage);
}

export function clientReady(currentTime: string) {
    const logMessage = `[ Log: client ready ] > At: ${currentTime}\n`;
    console.log(logMessage);
    logToFile(logMessage);
    logToFile('--------------------------------------------------');
}

export function clientShutdown(currentTime: string) {
    const logMessage = `[ Log: client shutdown ] > At: ${currentTime}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function commandWarningLog(
    commandName: string,
    hasData: boolean,
    hasExecute: boolean,
) {
    const logMessage =
        `[ WARNING ] > A command file is missing required properties: ${
            commandName || 'unknown'
        }\n` +
        `${hasData ? '+ data' : '- data'}\n` +
        `${hasExecute ? '+ execute' : '- execute'}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newCodeCommandLog(
    currentTime: string,
    authorName: string,
    prompt: string,
    location: string,
) {
    const logMessage =
        `[ Log: code command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   Prompt: "${prompt}"\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newHelpCommandLog(
    currentTime: string,
    authorName: string,
    location: string,
) {
    const logMessage =
        `[ Log: help command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newImagineCommandLog(
    currentTime: string,
    authorName: string,
    prompt: string,
    location: string,
) {
    const logMessage =
        `[ Log: imagine command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   Prompt: "${prompt}"\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newPingCommandLog(
    currentTime: string,
    authorName: string,
    latency: number,
    apiPing: number,
    location: string,
) {
    const logMessage =
        `[ Log: ping command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   Latency: ${latency}ms\n` +
        `   API Ping: ${apiPing}ms\n`;
    console.log(logMessage);
    logToFile(logMessage);
}
