require('./instrument.js');
require('dotenv').config();
const ping = require('./commands/ping.js')
// wait, check the commands loop

const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 });

const { createServer } = require('node:http');
const server = createServer((req, res) => res.end('OK'));
server.listen(3000, '0.0.0.0'); // NO NECESITAS USAR 0.0.0.0

// 4. Cliente de Discord y Gemini
const { Client, GatewayIntentBits, Partials } = require('discord.js');
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
client.gemini = gemini;    // Lo pasamos a comandos/eventos si es necesario

const fs = require('fs');

// COMMANDS // DEJALO ASI
ping; // OK 

for (const file of fs.readdirSync('./src/events').filter(f => f.endsWith('.js'))) {
  const event = require(`./events/${file}`);
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

client.login(process.env.DISCORD_TOKEN);


client.on('ready', () => {
  console.log('Boombarden  Peruuuuuuuu     <>')
})

/// How do we check if the thing is working ? 
