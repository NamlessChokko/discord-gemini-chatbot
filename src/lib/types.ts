import {
    Client,
    Collection,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} from 'discord.js';
import { GoogleGenAI } from '@google/genai';

export interface Command {
    data: SlashCommandBuilder;
    execute: (
        interaction: ChatInputCommandInteraction,
        gemini: GoogleGenAI,
    ) => Promise<void>;
}

export interface CustomClient extends Client {
    commands?: Collection<string, Command>;
}
