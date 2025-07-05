import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ignoreList = []; // List of commands to ignore
const commands = [];
const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((f) => f.endsWith('.ts'));
for (const file of commandFiles) {
    if (ignoreList.includes(file)) {
        continue;
    }
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    commands.push(command.data.toJSON());
}
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = (await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands }));
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (error) {
        console.error(error);
    }
})();
