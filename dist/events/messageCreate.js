function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import systemInstructions from '../lib/systemInstructions.js';
var _ref = await import('../../config.json', {
    with: {
        type: 'json'
    }
}), config = _ref.default;
import { newMentionLog, newResponseLog, newCreateChatErrorLog, newSendMessageErrorLog } from '../lib/logging.js';
import { validReply, botShouldReply, substituteMentionUsernames, substituteNamesWithMentions, createHistory, formatUsageMetadata, createParts, devideLongMessages } from '../lib/utils.js';
export var name = 'messageCreate';
export function execute(message, gemini, client) {
    return _async_to_generator(function() {
        var _message_guild, _message_author, _message_author1, _client_user, _client_user1, _response_candidates_, _response_candidates, botReply, currentTime, location, authorName, botName, prompt, content, systemInstruction, history, chat, response, _, _tmp, error, responseText, modelVersion, usageMetadata, finishReason, longMessages, firstMessage, lastReply, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _$message, newReply, err, finalResponse;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!botShouldReply(message, client)) {
                        return [
                            2
                        ];
                    }
                    return [
                        4,
                        message.reply('Thinking...')
                    ];
                case 1:
                    botReply = _state.sent();
                    currentTime = new Date().toString();
                    location = message.channel.isDMBased() ? 'Direct Message' : "Server: ".concat((_message_guild = message.guild) === null || _message_guild === void 0 ? void 0 : _message_guild.name, " -> ").concat(message.channel.name, " ");
                    authorName = ((_message_author = message.author) === null || _message_author === void 0 ? void 0 : _message_author.globalName) || ((_message_author1 = message.author) === null || _message_author1 === void 0 ? void 0 : _message_author1.username) || 'Unknown User';
                    botName = config.messageCreate.forceCustomName ? config.botInfo.customName : ((_client_user = client.user) === null || _client_user === void 0 ? void 0 : _client_user.globalName) || ((_client_user1 = client.user) === null || _client_user1 === void 0 ? void 0 : _client_user1.username) || config.botInfo.customName;
                    prompt = substituteMentionUsernames(message.content, message.mentions.users);
                    content = createParts(prompt, message.attachments);
                    systemInstruction = systemInstructions.messageCreate(botName, authorName, location, currentTime);
                    newMentionLog(currentTime, authorName, prompt, location);
                    return [
                        4,
                        createHistory(message, client)
                    ];
                case 2:
                    history = _state.sent();
                    chat = null;
                    try {
                        chat = gemini.chats.create({
                            model: config.messageCreate.generation.model,
                            config: {
                                temperature: config.messageCreate.generation.temperature,
                                systemInstruction: systemInstruction,
                                thinkingConfig: {
                                    thinkingBudget: config.messageCreate.generation.thinkingBudget
                                }
                            },
                            history: history
                        });
                    } catch (error) {
                        botReply.edit(config.messageCreate.errorMessage);
                        newCreateChatErrorLog(currentTime, error, history);
                        return [
                            2
                        ];
                    }
                    response = null;
                    _state.label = 3;
                case 3:
                    _state.trys.push([
                        3,
                        6,
                        ,
                        7
                    ]);
                    _ = chat.sendMessage;
                    _tmp = {};
                    return [
                        4,
                        content
                    ];
                case 4:
                    return [
                        4,
                        _.apply(chat, [
                            (_tmp.message = _state.sent(), _tmp)
                        ])
                    ];
                case 5:
                    response = _state.sent();
                    return [
                        3,
                        7
                    ];
                case 6:
                    error = _state.sent();
                    newSendMessageErrorLog(currentTime, error, prompt, history);
                    botReply.edit(config.messageCreate.errorMessage);
                    return [
                        2
                    ];
                case 7:
                    responseText = (response === null || response === void 0 ? void 0 : response.text) || '(no text)';
                    modelVersion = (response === null || response === void 0 ? void 0 : response.modelVersion) || '(unknown model version)';
                    usageMetadata = formatUsageMetadata(response === null || response === void 0 ? void 0 : response.usageMetadata);
                    finishReason = (response === null || response === void 0 ? void 0 : (_response_candidates = response.candidates) === null || _response_candidates === void 0 ? void 0 : (_response_candidates_ = _response_candidates[0]) === null || _response_candidates_ === void 0 ? void 0 : _response_candidates_.finishReason) || '(unknown finish reason)';
                    newResponseLog(currentTime, responseText, modelVersion, usageMetadata, finishReason);
                    if (!validReply(response)) {
                        botReply.edit(config.messageCreate.errorMessage);
                        return [
                            2
                        ];
                    }
                    if (!(response.text.length > 2000)) return [
                        3,
                        16
                    ];
                    longMessages = devideLongMessages(response.text, 2000);
                    firstMessage = longMessages.shift();
                    if (firstMessage) {
                        botReply.edit(firstMessage);
                    }
                    lastReply = botReply;
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 8;
                case 8:
                    _state.trys.push([
                        8,
                        13,
                        14,
                        15
                    ]);
                    _iterator = longMessages[Symbol.iterator]();
                    _state.label = 9;
                case 9:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        12
                    ];
                    _$message = _step.value;
                    return [
                        4,
                        lastReply.reply(_$message)
                    ];
                case 10:
                    newReply = _state.sent();
                    console.log("Sent a follow-up message: ".concat(newReply.id));
                    lastReply = newReply;
                    _state.label = 11;
                case 11:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        9
                    ];
                case 12:
                    return [
                        3,
                        15
                    ];
                case 13:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        15
                    ];
                case 14:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 15:
                    return [
                        2
                    ];
                case 16:
                    finalResponse = substituteNamesWithMentions(response.text, message.mentions.users);
                    botReply.edit(finalResponse);
                    return [
                        2
                    ];
            }
        });
    })();
}
