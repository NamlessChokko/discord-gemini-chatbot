const ignoreList = []; // List of commands to ignore

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'src/commands');
for (const file of fs
    .readdirSync(commandsPath)
    .filter((f) => f.endsWith('.js'))) {
    if (ignoreList.includes(file)) {
        continue;
    }

    const command = require(`./src/commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
    });
    console.log('✅ Slash commands registered');
})();
