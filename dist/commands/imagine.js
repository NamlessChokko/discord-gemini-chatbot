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
import { GoogleGenAI, Modality } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { newImagineCommandLog } from '../lib/logging.js';
import { fileURLToPath } from 'url';
var _ref = await import('../../config.json', {
    with: {
        type: 'json'
    }
}), config = _ref.default;
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
export var helpMessage = "**/imagine** - Generate an image based on your prompt. Use this command to create images from text descriptions.";
export var data = new SlashCommandBuilder().setName('imagine').setDescription('Generate an imagine based on your prompt').addStringOption(function(opt) {
    return opt.setName('prompt').setDescription('Describe the image you want to generate').setRequired(true);
});
export function execute(interaction) {
    return _async_to_generator(function() {
        var _interaction_guild, prompt, gemini, _response_candidates__content, _response_candidates_, _response_candidates, response, parts, imageBuffer, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, part, _part_inlineData, imgPath, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    prompt = interaction.options.getString('prompt');
                    if (!!prompt) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        interaction.editReply('Prompt cannot be empty.')
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
                case 2:
                    newImagineCommandLog(new Date().toLocaleString(), interaction.user.username, prompt, ((_interaction_guild = interaction.guild) === null || _interaction_guild === void 0 ? void 0 : _interaction_guild.name) || 'DM');
                    return [
                        4,
                        interaction.reply({
                            content: 'Generating image...',
                            withResponse: true
                        })
                    ];
                case 3:
                    _state.sent();
                    gemini = new GoogleGenAI({
                        apiKey: process.env.GEMINI_API_KEY
                    });
                    _state.label = 4;
                case 4:
                    _state.trys.push([
                        4,
                        10,
                        ,
                        12
                    ]);
                    return [
                        4,
                        gemini.models.generateContent({
                            model: config.imagine.generation.model,
                            contents: prompt,
                            config: {
                                responseModalities: [
                                    Modality.IMAGE,
                                    Modality.TEXT
                                ],
                                temperature: config.imagine.generation.temperature
                            }
                        })
                    ];
                case 5:
                    response = _state.sent();
                    parts = ((_response_candidates = response.candidates) === null || _response_candidates === void 0 ? void 0 : (_response_candidates_ = _response_candidates[0]) === null || _response_candidates_ === void 0 ? void 0 : (_response_candidates__content = _response_candidates_.content) === null || _response_candidates__content === void 0 ? void 0 : _response_candidates__content.parts) || [];
                    imageBuffer = null;
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = parts[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            part = _step.value;
                            ;
                            if ((_part_inlineData = part.inlineData) === null || _part_inlineData === void 0 ? void 0 : _part_inlineData.data) {
                                imageBuffer = Buffer.from(part.inlineData.data, 'base64');
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
                    if (!imageBuffer) return [
                        3,
                        7
                    ];
                    imgPath = path.join(__dirname, 'out.png');
                    fs.writeFileSync(imgPath, imageBuffer);
                    return [
                        4,
                        interaction.editReply({
                            content: 'Here’s your image:',
                            files: [
                                imgPath
                            ]
                        })
                    ];
                case 6:
                    _state.sent();
                    fs.unlinkSync(imgPath);
                    return [
                        3,
                        9
                    ];
                case 7:
                    return [
                        4,
                        interaction.editReply(config.imagine.errorMessage)
                    ];
                case 8:
                    _state.sent();
                    _state.label = 9;
                case 9:
                    return [
                        3,
                        12
                    ];
                case 10:
                    error = _state.sent();
                    console.error('Error during Gemini image generation:', error);
                    return [
                        4,
                        interaction.editReply(config.imagine.errorMessage)
                    ];
                case 11:
                    _state.sent();
                    return [
                        3,
                        12
                    ];
                case 12:
                    return [
                        2
                    ];
            }
        });
    })();
}
