# Gemini ChatBot 🤖✨

**Gemini ChatBot** is a powerful Discord bot powered by the **Gemini 2.0 Flash API**. It enables natural language interaction through direct messages, mentions, and slash commands. Designed for performance and easy customization, this bot provides intelligent responses, helps with basic queries, and includes utility features like latency checks.

## 📌 Features

- 💬 **Natural Language Chat**: Responds to users via DM or mention using Google's Gemini API.
- 🧠 **Context-Aware**: Replies with a tone depending on the detected mood (neutral or humorous).
- 💻 **Slash Commands**: Offers various commands like `/help` and `/ping` for guidance and performance checks.
- 🌐 **Multi-language Support**: Accepts prompts in any language, responds in English.
- ⚙️ **Configurable Behavior**: Uses system instructions to shape replies and stay within Discord's message limits.
- 📊 **Performance Logging**: Integrated with Sentry for error tracking and monitoring.
- 🚀 **Fly.io Ready**: Deployable to Fly.io or any hosting platform.

## 📁 Project Structure

```
discord-gemini-chatbot/
│
├── src/
│   ├── commands/         # Slash commands like /help, /ping
│   ├── events/           # Discord event handlers (e.g. messageCreate, interactionCreate)
│   └── index.js          # Bot entry point
│
├── .env                  # Environment variables (tokens and API keys)
├── instrument.js         # Optional error monitoring (e.g. Sentry)
└── README.md             # This file
```

## 🛠️ Requirements

- Node.js v18+
- Discord bot token
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey))
- Optional: Sentry DSN for monitoring

## 🔧 Environment Variables

Create a `.env` file with the following:

```
DISCORD_TOKEN=your-discord-token
GEMINI_API_KEY=your-gemini-api-key
SENTRY_DSN=your-sentry-dsn (optional)
```

## 🚀 Running the Bot

```bash
npm install
node src/index.js
```

Make sure your bot is invited with appropriate **Intents** and **Slash command scope**.

## 📚 Slash Commands

| Command | Description                       |
| ------- | --------------------------------- |
| `/help` | Shows basic usage information     |
| `/ping` | Displays response and API latency |

## 💡 Usage Tips

- Mention the bot (`@Gemini`) or send it a DM to start chatting.
- Responses are limited to \~2000 characters due to Discord message limits.
- Use slash commands for specific functionalities.

## ⚠️ Limitations

- Each response is capped to **499 tokens** for performance.
- Bot responses are always in English, regardless of input language.
- Inappropriate prompts may trigger predefined responses or be ignored.

This limitations can be ignore by changing API usage config.

## 📜 License

This project is licensed for educational and personal use. For any public deployment or commercial application, please ensure compliance with Google's API usage policies.

---

*Created with 💻 by NamlessChokko and Spectre*

