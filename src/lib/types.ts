import {
    Client,
    Collection,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} from 'discord.js';

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface CustomClient extends Client {
    commands?: Collection<string, Command>;
    helpMessage?: string;
}
