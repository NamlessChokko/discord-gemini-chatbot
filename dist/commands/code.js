function _async_iterator(iterable) {
    var method, async, sync, retry = 2;
    for("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;){
        if (async && null != (method = iterable[async])) return method.call(iterable);
        if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable));
        async = "@@asyncIterator", sync = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(s) {
    function AsyncFromSyncIteratorContinuation(r) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
        var done = r.done;
        return Promise.resolve(r.value).then(function(value) {
            return {
                value: value,
                done: done
            };
        });
    }
    return AsyncFromSyncIterator = function(s) {
        this.s = s, this.n = s.next;
    }, AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function() {
            return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        return: function(value) {
            var ret = this.s.return;
            return void 0 === ret ? Promise.resolve({
                value: value,
                done: !0
            }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
        },
        throw: function(value) {
            var thr = this.s.return;
            return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
        }
    }, new AsyncFromSyncIterator(s);
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
import { SlashCommandBuilder } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
export var helpMessage = "**/code** - Generate code based on your prompt. Use this command to get code snippets or examples for programming tasks.";
export var data = new SlashCommandBuilder().setName('code').setDescription('Generate code based on your prompt').addStringOption(function(option) {
    return option.setName('prompt').setDescription('Describe what kind of code you need').setRequired(true);
});
export function execute(interaction) {
    return _async_to_generator(function() {
        var systemInstructions, prompt, gemini, responseStream, result, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, chunk, err, error, currentTime;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        interaction.reply({
                            content: 'Generating code...',
                            withResponse: true
                        })
                    ];
                case 1:
                    _state.sent();
                    systemInstructions = [
                        'YOUR ROLE: You are a code generator bot for Discord.',
                        'Your name is Gemini.',
                        'You use the Gemini 2.5 API.',
                        'Respond only with code unless context requires clarification.',
                        'Use comments inside code if you need to explain something.',
                        "Always respond in English, regardless of the prompt's language.",
                        "User to respond: ".concat(interaction.user.username),
                        'Do not use Markdown formatting.',
                        'Maintain a formal and neutral tone unless otherwise requested.'
                    ];
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        19,
                        ,
                        21
                    ]);
                    prompt = interaction.options.getString('prompt');
                    if (!!prompt) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        interaction.editReply('Prompt cannot be empty.')
                    ];
                case 3:
                    _state.sent();
                    return [
                        2
                    ];
                case 4:
                    gemini = new GoogleGenAI({
                        apiKey: process.env.GEMINI_API_KEY
                    });
                    return [
                        4,
                        gemini.models.generateContentStream({
                            model: 'gemini-2.5-flash',
                            contents: prompt,
                            config: {
                                temperature: 1.5,
                                maxOutputTokens: 499,
                                systemInstruction: systemInstructions
                            }
                        })
                    ];
                case 5:
                    responseStream = _state.sent();
                    result = '';
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 6;
                case 6:
                    _state.trys.push([
                        6,
                        12,
                        13,
                        18
                    ]);
                    _iterator = _async_iterator(responseStream);
                    _state.label = 7;
                case 7:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 8:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        11
                    ];
                    _value = _step.value;
                    chunk = _value;
                    if (!chunk.text) return [
                        3,
                        10
                    ];
                    result += chunk.text;
                    if (result.length > 1995) {
                        result = result.slice(0, 1995) + '...';
                        return [
                            3,
                            11
                        ];
                    }
                    return [
                        4,
                        interaction.editReply(result)
                    ];
                case 9:
                    _state.sent();
                    _state.label = 10;
                case 10:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        7
                    ];
                case 11:
                    return [
                        3,
                        18
                    ];
                case 12:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        18
                    ];
                case 13:
                    _state.trys.push([
                        13,
                        ,
                        16,
                        17
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        15
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 14:
                    _state.sent();
                    _state.label = 15;
                case 15:
                    return [
                        3,
                        17
                    ];
                case 16:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 17:
                    return [
                        7
                    ];
                case 18:
                    return [
                        3,
                        21
                    ];
                case 19:
                    error = _state.sent();
                    currentTime = new Date().toLocaleTimeString();
                    console.error("Error at ".concat(currentTime, ":"), error);
                    return [
                        4,
                        interaction.editReply('Oops! Something went wrong while generating your code.')
                    ];
                case 20:
                    _state.sent();
                    return [
                        3,
                        21
                    ];
                case 21:
                    return [
                        2
                    ];
            }
        });
    })();
}
