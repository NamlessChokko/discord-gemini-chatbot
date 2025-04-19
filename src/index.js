require("..instrument.js");
require('dotenv').config();

// All other imports below
const { createServer } = require("node:http");

const server = createServer((req, res) => {
    // server code
});

server.listen(3000, "127.0.0.1");


const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages ] });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const gemini = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });



const Sentry = require("@sentry/node");
try {
  foo();
} catch (e) {
  Sentry.captureException(e);
}