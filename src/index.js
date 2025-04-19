const { Client, GatewayIntentBits, Partials, Message } = require('discord.js');

require('./instrument.js');
require('dotenv').config();
const ping = require('./commands/ping.js')

const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 });

const { createServer } = require('node:http');
const server = createServer((req, res) => res.end('OK'));
server.listen(3000, '0.0.0.0');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});
const gemini = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
client.gemini = gemini;   

const fs = require('fs');


for (const file of fs.readdirSync('./src/events').filter(f => f.endsWith('.js'))) {
  const event = require(`./events/${file}`);
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

client.login(process.env.DISCORD_TOKEN);


client.on('ready', () => {
  console.log('Gemini is ready 7u7')
})


const message = Message
ping(client)