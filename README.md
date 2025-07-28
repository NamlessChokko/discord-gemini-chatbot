# Gemini ChatBot 🤖✨

**Gemini ChatBot** is a powerful Discord bot powered by the **Gemini 2.5 API**. It enables natural language interaction through direct messages, mentions, and slash commands. Designed for performance and easy customization, this bot provides intelligent responses, helps with basic queries, and includes utility slash commands for specific tasks.

## 📌 Features

- 💬 **Natural Language Chat**: Responds to users via DM or mention using Google's Gemini API.
- 🧠 **Context-Aware**: Replies with a tone depending on the detected mood (neutral or humorous).
- 📖 **History Context**: The bot is capable of reading the chain of linked messages while maintaining the entire context of the conversation.
- 💻 **Slash Commands**: Offers various commands like `/help`, `/ping`, `/code`, and `/imagine` for guidance, performance checks, code generation, and image creation.
- ⚙️ **Configurable Behavior**: Uses system instructions to shape replies and stay within Discord's message limits.
- 🎬 **Multimodal**: You can interact with several types of data, not only text.

## 📁 Project Structure

```
discord-gemini-chatbot/
│
├── src/
│   ├── commands/         # Slash commands like /help, /ping, /code, /imagine
│   ├── events/           # Discord event handlers (e.g. messageCreate, interactionCreate)
│   ├── lib/              # Shared utilities, types, and internal logic reused across the bot
│   └── index.ts          # Bot entry point
│
├── .env                  # Environment variables (tokens and API keys)
└── README.md             # Project documentation

```

## 🛠️ Requirements

- Node.js v18+
- Discord bot token
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey))

## 🔧 Environment Variables

Create a `.env` file with the following:

```
DISCORD_TOKEN=your-discord-token
CLIENT_ID=your-bot-id
GEMINI_API_KEY=your-gemini-api-key

```

## 🚀 Running the Bot

```bash
npm install
npm run build
npm run start
```

Make sure your bot is invited with appropriate **Intents** and **Slash command scope**.

## ⚙️ Config file

There is a `config.json` file in the root directory, edit this file for specific behaviors, custom modifications or API usage. It provides easy access to bot functionality.

## 📚 Slash Commands

| Command    | Description                            |
| ---------- | -------------------------------------- |
| `/help`    | Shows basic usage information          |
| `/ping`    | Displays response and API latency      |
| `/code`    | Generate code based on your prompt     |
| `/imagine` | Generate an image based on your prompt |

## 💡 Usage Tips

- Mention the bot (`@Gemini`) or send it a DM to start chatting.
- Responses are limited to \~2000 characters per message, if the bot reach the limit, it will split the response in multiple messages.
- Use slash commands for specific functionalities.

---

\_Created with 💻 by NamlessChokko
