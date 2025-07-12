import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const { default: config } = await import('../config.json', {
    with: { type: 'json' },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ignoreList: string[] = config.loadCommands.ignoreList; // List of commands to ignore

const commands: unknown[] = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((f) => f.endsWith('.js'));

for (const file of commandFiles) {
    if (ignoreList.includes(file)) {
        continue;
    }

    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_TOKEN as string,
);

(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`,
        );

        const data = (await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID as string),
            { body: commands },
        )) as { length: number };

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`,
        );
    } catch (error) {
        console.error(error);
    }
})();
