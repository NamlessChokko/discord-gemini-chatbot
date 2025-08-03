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

export interface MessageData {
    currentTime: string;
    location: string;
    author: string;
    prompt: string;
}

export interface GenerationConfig {
    model: string;
    temperature: number;
    thinkingBudget: number;
    botName: string;
}
