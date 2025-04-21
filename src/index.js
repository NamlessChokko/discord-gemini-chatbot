require('./instrument.js');
require('dotenv').config();


const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 });


const { createServer } = require('node:http');
const server = createServer((req, res) => res.end('OK'));
server.listen(3000, '0.0.0.0');


const { Client, GatewayIntentBits, Partials, Message, Collection } = require('discord.js');
const { GoogleGenAI } = require ("@google/genai")


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
client.gemini = gemini;   

const fs = require('fs');



// Getting commands:
client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
  }
}




// Getting Event: 
const eventFiles = fs.readdirSync('./src/events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


client.login(process.env.DISCORD_TOKEN);


client.on('ready', () => {
  console.log('Gemini is ready 7u7')
})
