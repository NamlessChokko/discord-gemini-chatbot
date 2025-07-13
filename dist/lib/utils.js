function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
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
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
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
import { Collection, InteractionType } from 'discord.js';
import util from 'node:util';
var _ref = await import('../../config.json', {
    with: {
        type: 'json'
    }
}), config = _ref.default;
var logFile = fs.createWriteStream(config.application.logFile, {
    flags: 'a'
});
export function logToFile(message) {
    logFile.write(util.format(message) + '\n');
}
export function substituteMentionUsernames(content, mentions) {
    if (!content || content.length === 0) {
        return '';
    }
    if (!mentions || mentions.size === 0) {
        return content;
    }
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = mentions.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var user = _step.value;
            var regex = new RegExp("<@!?".concat(user.id, ">"), 'g');
            content = content.replace(regex, user.username);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return content;
}
export function substituteNamesWithMentions(content, mentions) {
    if (!content || content.length === 0) {
        return '';
    }
    if (!mentions || mentions.size === 0) {
        return content;
    }
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = mentions.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var user = _step.value;
            var regex = new RegExp("\\b".concat(user.username, "\\b"), 'gi');
            content = content.replace(regex, "<@".concat(user.id, ">"));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return content;
}
export function botShouldReply(message, client) {
    var _client_user;
    if (!message.channel.isDMBased() && !message.mentions.has(client.user)) {
        return false;
    }
    if (message.mentions.everyone) {
        return false;
    }
    if (message.author.tag === ((_client_user = client.user) === null || _client_user === void 0 ? void 0 : _client_user.tag)) {
        return false;
    }
    if (!message.content) {
        return false;
    }
    return true;
}
export function validReply(response) {
    if (!response) {
        return false;
    }
    try {
        var text = response.text;
        if (!text || text.trim().length === 0) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}
export function createHistory(message, client) {
    return _async_to_generator(function() {
        var history, cursor, maxHistoryLength, _client_user, parent, role, _, _tmp;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    history = [];
                    cursor = message;
                    maxHistoryLength = config.messageCreate.generation.maxHistoryLength > 0 ? config.messageCreate.generation.maxHistoryLength : Number.MAX_SAFE_INTEGER;
                    _state.label = 1;
                case 1:
                    if (!(cursor.reference && cursor.reference.messageId)) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        message.channel.messages.fetch(cursor.reference.messageId)
                    ];
                case 2:
                    parent = _state.sent();
                    role = parent.author.id === ((_client_user = client.user) === null || _client_user === void 0 ? void 0 : _client_user.id) ? 'model' : 'user';
                    _ = history.unshift;
                    _tmp = {
                        role: role
                    };
                    return [
                        4,
                        createParts(parent.content, parent.attachments)
                    ];
                case 3:
                    _.apply(history, [
                        (_tmp.parts = _state.sent(), _tmp)
                    ]);
                    if (parent.interactionMetadata && parent.interactionMetadata.type === InteractionType.ApplicationCommand && role === 'model') {
                        history.unshift({
                            role: 'user',
                            parts: [
                                {
                                    text: "[Slash Command by: ".concat(parent.interactionMetadata.user.username, "]")
                                }
                            ]
                        }, {
                            role: 'model',
                            parts: [
                                {
                                    text: "This message was generated in response to a slash command interaction."
                                }
                            ]
                        });
                        return [
                            3,
                            4
                        ];
                    }
                    if (history.length >= maxHistoryLength && role === 'user') {
                        return [
                            3,
                            4
                        ];
                    }
                    cursor = parent;
                    return [
                        3,
                        1
                    ];
                case 4:
                    return [
                        2,
                        history
                    ];
            }
        });
    })();
}
export function formatUsageMetadata(usageMetadata) {
    if (!usageMetadata) {
        return '(no usage metadata)';
    }
    var responseFormated = JSON.stringify(usageMetadata, null, 2).split('\n').map(function(line) {
        return "   ".concat(line);
    }).join('\n');
    return responseFormated;
}
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { commandWarningLog } from './logging.js';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
export function loadCommands(client) {
    return _async_to_generator(function() {
        var commandsPath, commandFiles, commandPromises, commands, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, command, cmd, _cmd_data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    client.commands = new Collection();
                    commandsPath = path.join(__dirname, '..', 'commands');
                    commandFiles = fs.readdirSync(commandsPath).filter(function(file) {
                        return file.endsWith('.js');
                    });
                    commandPromises = commandFiles.map(function(file) {
                        var filePath = path.join(commandsPath, file);
                        return import(filePath);
                    });
                    return [
                        4,
                        Promise.all(commandPromises)
                    ];
                case 1:
                    commands = _state.sent();
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = commands[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            command = _step.value;
                            cmd = command.default || command;
                            if ('data' in cmd && 'execute' in cmd && 'helpMessage' in cmd) {
                                client.commands.set(cmd.data.name, cmd);
                            } else {
                                ;
                                commandWarningLog((_cmd_data = cmd.data) === null || _cmd_data === void 0 ? void 0 : _cmd_data.name, 'data' in cmd, 'execute' in cmd, 'helpMessage' in cmd);
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    return [
                        2
                    ];
            }
        });
    })();
}
export function loadEvents(client, gemini) {
    return _async_to_generator(function() {
        var eventPath, eventFiles, eventPromises, events, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    eventPath = path.join(__dirname, '..', 'events');
                    eventFiles = fs.readdirSync(eventPath).filter(function(file) {
                        return file.endsWith('.js');
                    });
                    eventPromises = eventFiles.map(function(file) {
                        var filePath = path.join(eventPath, file);
                        return import(filePath);
                    });
                    return [
                        4,
                        Promise.all(eventPromises)
                    ];
                case 1:
                    events = _state.sent();
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        _loop = function() {
                            var event = _step.value;
                            if (event.once) {
                                var _event;
                                client.once(event.name, function() {
                                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                        args[_key] = arguments[_key];
                                    }
                                    return (_event = event).execute.apply(_event, _to_consumable_array(args).concat([
                                        gemini,
                                        client
                                    ]));
                                });
                            } else {
                                client.on(event.name, function() {
                                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                                        args[_key] = arguments[_key];
                                    }
                                    var _event;
                                    (_event = event).execute.apply(_event, _to_consumable_array(args).concat([
                                        gemini,
                                        client
                                    ]));
                                });
                            }
                        };
                        for(_iterator = events[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    return [
                        2
                    ];
            }
        });
    })();
}
export function createParts(message, media) {
    return _async_to_generator(function() {
        var parts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, attachment, file, buffer, base64Data, error, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    parts = [];
                    if (message && message.length > 0) {
                        parts.push({
                            text: message
                        });
                    }
                    if (!(media && media.size > 0)) return [
                        3,
                        11
                    ];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        9,
                        10,
                        11
                    ]);
                    _iterator = media.values()[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        8
                    ];
                    attachment = _step.value;
                    _state.label = 3;
                case 3:
                    _state.trys.push([
                        3,
                        6,
                        ,
                        7
                    ]);
                    return [
                        4,
                        fetch(attachment.url)
                    ];
                case 4:
                    file = _state.sent();
                    if (!file.ok) {
                        console.error("Failed to fetch attachment: ".concat(attachment.url, " - ").concat(file.statusText));
                        return [
                            3,
                            7
                        ];
                    }
                    return [
                        4,
                        file.arrayBuffer()
                    ];
                case 5:
                    buffer = _state.sent();
                    base64Data = Buffer.from(buffer).toString('base64');
                    console.log("Processing attachment: ".concat(attachment.name, " - (").concat(attachment.contentType, ")"));
                    parts.push({
                        inlineData: {
                            mimeType: attachment.contentType || 'application/octet-stream',
                            data: base64Data
                        }
                    });
                    return [
                        3,
                        7
                    ];
                case 6:
                    error = _state.sent();
                    console.error("Error processing attachment: ".concat(attachment.name), error);
                    return [
                        3,
                        7
                    ];
                case 7:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        2
                    ];
                case 8:
                    return [
                        3,
                        11
                    ];
                case 9:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        11
                    ];
                case 10:
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
                case 11:
                    return [
                        2,
                        parts
                    ];
            }
        });
    })();
}
export function devideLongMessages(message) {
    var maxLength = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2000;
    if (message.length <= maxLength) {
        return [
            message
        ];
    }
    var parts = [];
    var currentPart = '';
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = message.split(' ')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var word = _step.value;
            if (currentPart.length + word.length + 1 > maxLength) {
                parts.push(currentPart.trim());
                currentPart = '';
            }
            currentPart += "".concat(word, " ");
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    if (currentPart.length > 0) {
        parts.push(currentPart.trim());
    }
    return parts;
}
