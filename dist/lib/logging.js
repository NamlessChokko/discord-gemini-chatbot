import { logToFile } from './utils.js';
import util from 'node:util';
export function newMentionLog(currentTime, authorName, content, isDM, location) {
    const logMessage = `[ Log: mention ] > At: ${currentTime}\n` +
        `   Interaction: ${isDM ? 'DM' : 'mention'}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   content: "${content}"\n`;
    console.log(logMessage);
    logToFile(logMessage);
}
export function newResponseLog(currentTime, responseText, modelVersion, usageMetadata, finishReason) {
    const logMessage = `[ Log: response ] > At: ${currentTime}\n` +
        `   Text: ${responseText}\n` +
        `   Model Version: ${modelVersion}\n` +
        `   Usage Metadata:\n` +
        `${usageMetadata}\n` +
        `   Finish Reason: ${finishReason}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}
export function newCreateChatErrorLog(currentTime, error, history) {
    const logMessage = `[ Log: create chat error ] > At: ${currentTime}\n` +
        `   History Length: ${history.length}\n` +
        `   History: ${JSON.stringify(history, null, 2)}\n` +
        `   > Error: ${util.inspect(error)}`;
    console.error(logMessage);
    logToFile(logMessage);
}
export function newSendMessageErrorLog(time, error, content, history) {
    const logMessage = `[ Log: send message error ] > At: ${time}\n` +
        `   Content: "${content}"\n` +
        `   History Length: ${history.length}\n` +
        `   History: ${JSON.stringify(history, null, 2)}\n` +
        `   > Error: ${util.inspect(error)}`;
    console.error(logMessage);
    logToFile(logMessage);
}
export function clientReady(currentTime) {
    const logMessage = `[ Log: client ready ] > At: ${currentTime}\n`;
    console.log(logMessage);
    logToFile(logMessage);
    logToFile('--------------------------------------------------');
}
export function clientShutdown(currentTime) {
    const logMessage = `[ Log: client shutdown ] > At: ${currentTime}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}
export function commandWarningLog(commandName, hasData, hasExecute, hasHelpMessage) {
    const logMessage = `[ WARNING ] > A command file is missing required properties: ${commandName || 'unknown'}\n` +
        `${hasData ? '+ data' : '- data'}\n` +
        `${hasExecute ? '+ execute' : '- execute'}\n` +
        `${hasHelpMessage ? '+ helpMessage' : '- helpMessage'}`;
    console.log(logMessage);
    logToFile(logMessage);
}
export function newCodeCommandLog(currentTime, authorName, prompt, location) {
    const logMessage = `[ Log: code command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   Prompt: "${prompt}"\n`;
    console.log(logMessage);
    logToFile(logMessage);
}
export function newHelpCommandLog(currentTime, authorName, location) {
    const logMessage = `[ Log: help command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}
export function newImagineCommandLog(currentTime, authorName, prompt, location) {
    const logMessage = `[ Log: imagine command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   Prompt: "${prompt}"\n`;
    console.log(logMessage);
    logToFile(logMessage);
}
export function newPingCommandLog(currentTime, authorName, latency, apiPing, location) {
    const logMessage = `[ Log: ping command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   Latency: ${latency}ms\n` +
        `   API Ping: ${apiPing}ms\n`;
    console.log(logMessage);
    logToFile(logMessage);
}
