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
import { newCodeCommandLog } from '../lib/logging.js';
import systemInstructions from '../lib/systemInstructions.js';
export var data = new SlashCommandBuilder().setName('code').setDescription('Generate code based on your prompt').addStringOption(function(option) {
    return option.setName('prompt').setDescription('Describe what kind of code you need').setRequired(true);
});
export function execute(interaction, gemini) {
    return _async_to_generator(function() {
        var _interaction_guild, _response_candidates__content, _response_candidates_, _response_candidates, prompt, systemInstruction, response, error, currentTime, parts;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    prompt = interaction.options.getString('prompt');
                    if (!prompt) {
                        return [
                            2
                        ];
                    }
                    newCodeCommandLog(new Date().toLocaleString(), interaction.user.username, prompt, ((_interaction_guild = interaction.guild) === null || _interaction_guild === void 0 ? void 0 : _interaction_guild.name) || 'Direct Message');
                    return [
                        4,
                        interaction.reply({
                            content: 'Generating code...',
                            withResponse: true
                        })
                    ];
                case 1:
                    _state.sent();
                    systemInstruction = systemInstructions.code(interaction.user.globalName || interaction.user.username || 'Uknown User');
                    response = null;
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        4,
                        ,
                        6
                    ]);
                    return [
                        4,
                        gemini.models.generateContent({
                            model: 'gemini-2.5-flash',
                            contents: prompt,
                            config: {
                                temperature: 1.5,
                                systemInstruction: systemInstruction
                            }
                        })
                    ];
                case 3:
                    response = _state.sent();
                    return [
                        3,
                        6
                    ];
                case 4:
                    error = _state.sent();
                    currentTime = new Date().toLocaleTimeString();
                    console.error("Error at ".concat(currentTime, ":"), error);
                    return [
                        4,
                        interaction.editReply('Oops! Something went wrong while generating your code.')
                    ];
                case 5:
                    _state.sent();
                    return [
                        3,
                        6
                    ];
                case 6:
                    parts = (response === null || response === void 0 ? void 0 : (_response_candidates = response.candidates) === null || _response_candidates === void 0 ? void 0 : (_response_candidates_ = _response_candidates[0]) === null || _response_candidates_ === void 0 ? void 0 : (_response_candidates__content = _response_candidates_.content) === null || _response_candidates__content === void 0 ? void 0 : _response_candidates__content.parts) || [];
                    interaction.editReply({
                        content: 'Here’s your generated code:',
                        files: [
                            {
                                attachment: Buffer.from(parts.map(function(part) {
                                    return part.text;
                                }).join(''), 'utf-8'),
                                name: 'generated_code.js'
                            }
                        ]
                    });
                    return [
                        2
                    ];
            }
        });
    })();
}
