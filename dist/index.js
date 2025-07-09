function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
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
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createServer } from 'node:http';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var server = createServer();
server.listen(3000, '0.0.0.0');
var client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel
    ]
});
var gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
client.commands = new Collection();
var commandsPath = path.join(__dirname, 'commands');
var commandFiles = fs.readdirSync(commandsPath).filter(function(file) {
    return file.endsWith('.js');
});
var commandPromises = commandFiles.map(function(file) {
    var filePath = path.join(commandsPath, file);
    return import(filePath);
});
var commands = await Promise.all(commandPromises);
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    for(var _iterator = commands[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
        var command = _step.value;
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log("[ WARNING ] > A command file is missing 'data' or 'execute'");
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
var eventPath = path.join(__dirname, 'events');
var eventFiles = fs.readdirSync(eventPath).filter(function(file) {
    return file.endsWith('.js');
});
var eventPromises = eventFiles.map(function(file) {
    var filePath = path.join(eventPath, file);
    return import(filePath);
});
var events = await Promise.all(eventPromises);
var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
try {
    var _loop = function() {
        var event = _step1.value;
        if (event.once) {
            var _event;
            client.once(event.name, function() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                return (_event = event).execute.apply(_event, _to_consumable_array(args).concat([
                    client,
                    gemini
                ]));
            });
        } else {
            client.on(event.name, function() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                var _event;
                (_event = event).execute.apply(_event, _to_consumable_array(args).concat([
                    client,
                    gemini
                ]));
            });
        }
    };
    for(var _iterator1 = events[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true)_loop();
} catch (err) {
    _didIteratorError1 = true;
    _iteratorError1 = err;
} finally{
    try {
        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
            _iterator1.return();
        }
    } finally{
        if (_didIteratorError1) {
            throw _iteratorError1;
        }
    }
}
client.login(process.env.DISCORD_TOKEN);
client.on('ready', function() {
    console.log('Gemini is ready 7u7');
});
client.on('error', function(error) {
    console.error('Discord client error:', error);
});
