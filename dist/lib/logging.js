import { logToFile } from './utils.js';
import util from 'node:util';
export function newMentionLog(currentTime, authorName, content, location) {
    var logMessage = "[ Log: mention ] > At: ".concat(currentTime, "\n") + "   Author: ".concat(authorName, "\n") + "   Location: ".concat(location, "\n") + '   content: "'.concat(content, '"\n');
    console.log(logMessage);
    logToFile(logMessage);
}
export function newResponseLog(currentTime, responseText, modelVersion, usageMetadata, finishReason) {
    var logMessage = "[ Log: response ] > At: ".concat(currentTime, "\n") + "   Text: ".concat(responseText, "\n") + "   Model Version: ".concat(modelVersion, "\n") + "   Usage Metadata:\n" + "".concat(usageMetadata, "\n") + "   Finish Reason: ".concat(finishReason, "\n");
    console.log(logMessage);
    logToFile(logMessage);
}
export function newCreateChatErrorLog(currentTime, error, history) {
    var logMessage = "[ Log: create chat error ] > At: ".concat(currentTime, "\n") + "   History Length: ".concat(history.length, "\n") + "   History: ".concat(JSON.stringify(history, null, 2), "\n") + "   > Error: ".concat(util.inspect(error));
    console.error(logMessage);
    logToFile(logMessage);
}
export function newSendMessageErrorLog(time, error, content, history) {
    var logMessage = "[ Log: send message error ] > At: ".concat(time, "\n") + '   Content: "'.concat(content, '"\n') + "   History Length: ".concat(history.length, "\n") + "   History: ".concat(JSON.stringify(history, null, 2), "\n") + "   > Error: ".concat(util.inspect(error));
    console.error(logMessage);
    logToFile(logMessage);
}
export function clientReady(currentTime) {
    var logMessage = "[ Log: client ready ] > At: ".concat(currentTime, "\n");
    console.log(logMessage);
    logToFile(logMessage);
    logToFile('--------------------------------------------------');
}
export function clientShutdown(currentTime) {
    var logMessage = "[ Log: client shutdown ] > At: ".concat(currentTime, "\n");
    console.log(logMessage);
    logToFile(logMessage);
}
export function commandWarningLog(commandName, hasData, hasExecute) {
    var logMessage = "[ WARNING ] > A command file is missing required properties: ".concat(commandName || 'unknown', "\n") + "".concat(hasData ? '+ data' : '- data', "\n") + "".concat(hasExecute ? '+ execute' : '- execute', "\n");
    console.log(logMessage);
    logToFile(logMessage);
}
export function newCodeCommandLog(currentTime, authorName, prompt, location) {
    var logMessage = "[ Log: code command ] > At: ".concat(currentTime, "\n") + "   Author: ".concat(authorName, "\n") + "   Location: ".concat(location, "\n") + '   Prompt: "'.concat(prompt, '"\n');
    console.log(logMessage);
    logToFile(logMessage);
}
export function newHelpCommandLog(currentTime, authorName, location) {
    var logMessage = "[ Log: help command ] > At: ".concat(currentTime, "\n") + "   Author: ".concat(authorName, "\n") + "   Location: ".concat(location, "\n");
    console.log(logMessage);
    logToFile(logMessage);
}
export function newImagineCommandLog(currentTime, authorName, prompt, location) {
    var logMessage = "[ Log: imagine command ] > At: ".concat(currentTime, "\n") + "   Author: ".concat(authorName, "\n") + "   Location: ".concat(location, "\n") + '   Prompt: "'.concat(prompt, '"\n');
    console.log(logMessage);
    logToFile(logMessage);
}
export function newPingCommandLog(currentTime, authorName, latency, apiPing, location) {
    var logMessage = "[ Log: ping command ] > At: ".concat(currentTime, "\n") + "   Author: ".concat(authorName, "\n") + "   Location: ".concat(location, "\n") + "   Latency: ".concat(latency, "ms\n") + "   API Ping: ".concat(apiPing, "ms\n");
    console.log(logMessage);
    logToFile(logMessage);
}
