import { CustomClient } from '../lib/types.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { GoogleGenAI } from '@google/genai';

/**
 * Internal interaction handlers for processing Discord interactions.
 * This module contains handlers that are called by Discord event listeners when users interact with the bot.
 *
 * @internal These handlers are used by the Discord event system, not called directly by users
 */
export default {
    /**
     * Handles Discord slash command interactions by routing them to the appropriate command handler.
     * This is an internal function called when users execute slash commands.
     *
     * @param interaction - The ChatInputCommandInteraction from Discord
     * @param gemini - The GoogleGenAI instance to pass to command handlers
     * @returns A promise that resolves when the command execution is complete
     *
     * @remarks
     * - Looks up the command in the client's commands collection by name
     * - Passes both the interaction and gemini instance to the command's execute function
     * - Logs errors if the command is not found or execution fails
     * - Does not reply to the interaction if command is missing (command should handle its own responses)
     * - Each command is responsible for responding to the interaction within Discord's 3-second limit
     *
     * @internal This function is called by Discord event handlers, not by end users
     *
     * @example
     * ```typescript
     * // Called automatically when user runs: /ping
     * // The handler finds the 'ping' command and executes it
     * await chatInputCommand(interaction, geminiInstance);
     * ```
     */
    chatInputCommand: async (
        interaction: ChatInputCommandInteraction,
        gemini: GoogleGenAI,
    ) => {
        const command = (interaction.client as CustomClient).commands!.get(
            interaction.commandName,
        );

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`,
            );
            return;
        }

        try {
            await command.execute(interaction, gemini);
        } catch (error) {
            console.error('interactionCreate error: ', error);
        }
    },
};
