import util from 'node:util';
import fs from 'node:fs';
import { MessageData } from './types.js';

const { default: config } = await import('../../config.json', {
    with: { type: 'json' },
});

const logFile = fs.createWriteStream(config.application.logFile, {
    flags: 'a',
});

export function logToFile(message: string) {
    logFile.write(util.format(message) + '\n');
}

export function newMentionLog({
    currentTime,
    author,
    location,
    prompt,
}: MessageData) {
    const logMessage =
        `[ Log: mention ] > At: ${currentTime}\n` +
        `   Author: ${author}\n` +
        `   Location: ${location}\n` +
        `   content: "${prompt}"\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newResponseLog({
    currentTime,
    responseText,
    modelVersion,
    usageMetadata,
    finishReason,
}: {
    currentTime: string;
    responseText: string;
    modelVersion: string;
    usageMetadata: string;
    finishReason: string;
}) {
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

export function newCreateChatErrorLog({
    currentTime,
    error,
    history,
}: {
    currentTime: string;
    error: unknown;
    history: unknown[];
}) {
    const logMessage =
        `[ Log: create chat error ] > At: ${currentTime}\n` +
        `   History Length: ${history.length}\n` +
        `   History: ${JSON.stringify(history, null, 2)}\n` +
        `   > Error: ${util.inspect(error)}`;
    console.error(logMessage);
    logToFile(logMessage);
}

export function newSendMessageErrorLog({
    time,
    error,
    content,
    history,
}: {
    time: string;
    error: unknown;
    content: string;
    history: unknown[];
}) {
    const logMessage =
        `[ Log: send message error ] > At: ${time}\n` +
        `   Content: "${content}"\n` +
        `   History Length: ${history.length}\n` +
        `   History: ${JSON.stringify(history, null, 2)}\n` +
        `   > Error: ${util.inspect(error)}`;
    console.error(logMessage);
    logToFile(logMessage);
}

export function clientReady({ currentTime }: { currentTime: string }) {
    const logMessage = `[ Log: client ready ] > At: ${currentTime}\n`;
    console.log(logMessage);
    logToFile(logMessage);
    logToFile('--------------------------------------------------');
}

export function clientShutdown({ currentTime }: { currentTime: string }) {
    const logMessage = `[ Log: client shutdown ] > At: ${currentTime}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function commandWarningLog({
    commandName,
    hasData,
    hasExecute,
}: {
    commandName: string;
    hasData: boolean;
    hasExecute: boolean;
}) {
    const logMessage =
        `[ WARNING ] > A command file is missing required properties: ${
            commandName || 'unknown'
        }\n` +
        `${hasData ? '+ data' : '- data'}\n` +
        `${hasExecute ? '+ execute' : '- execute'}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newCodeCommandLog({
    currentTime,
    authorName,
    prompt,
    location,
}: {
    currentTime: string;
    authorName: string;
    prompt: string;
    location: string;
}) {
    const logMessage =
        `[ Log: code command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   Prompt: "${prompt}"\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newHelpCommandLog({
    currentTime,
    authorName,
    location,
}: {
    currentTime: string;
    authorName: string;
    location: string;
}) {
    const logMessage =
        `[ Log: help command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newImagineCommandLog({
    currentTime,
    authorName,
    prompt,
    location,
}: {
    currentTime: string;
    authorName: string;
    prompt: string;
    location: string;
}) {
    const logMessage =
        `[ Log: imagine command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   Prompt: "${prompt}"\n`;
    console.log(logMessage);
    logToFile(logMessage);
}

export function newPingCommandLog({
    currentTime,
    authorName,
    latency,
    apiPing,
    location,
}: {
    currentTime: string;
    authorName: string;
    latency: number;
    apiPing: number;
    location: string;
}) {
    const logMessage =
        `[ Log: ping command ] > At: ${currentTime}\n` +
        `   Author: ${authorName}\n` +
        `   Location: ${location}\n` +
        `   Latency: ${latency}ms\n` +
        `   API Ping: ${apiPing}ms\n`;
    console.log(logMessage);
    logToFile(logMessage);
}
