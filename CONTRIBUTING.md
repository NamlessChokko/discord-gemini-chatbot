# Contributing to Gemini ChatBot

Thank you for considering contributing to Gemini ChatBot! 🎉

## How to Contribute

### Prerequisites

- Node.js v18+
- npm or yarn
- A Discord bot token (for testing)
- A Google Gemini API key (for testing)

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

    ```bash
    git clone https://github.com/your-username/discord-gemini-chatbot.git
    cd discord-gemini-chatbot
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Set up environment variables**:

    ```bash
    cp .env.example .env
    # Edit .env with your actual tokens
    ```

5. **Build and run**:
    ```bash
    npm run build
    npm run start
    ```

### Development Workflow

1. **Create a branch** for your feature:

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **Make your changes** following our code style:

    - Use TypeScript
    - Follow ESLint rules (`npm run lint`)
    - Format code with Prettier (`npm run format`)

3. **Test your changes**:

    ```bash
    npm run dev  # For development with hot reload
    ```

4. **Commit your changes**:

    ```bash
    git add .
    git commit -m "feat: add your feature description"
    ```

5. **Push and create a Pull Request**:
    ```bash
    git push origin feature/your-feature-name
    ```

## Types of Contributions

### 🐛 Bug Reports

- Use the issue tracker
- Include steps to reproduce
- Provide bot logs if relevant

### ✨ Feature Requests

- Describe the feature and use case
- Consider if it fits the bot's scope

### 💻 Code Contributions

- New slash commands
- Improvements to existing features
- Performance optimizations
- Documentation improvements

### 📚 Documentation

- README improvements
- Code comments
- API documentation

## Code Style Guidelines

- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code is automatically formatted on save
- **Imports**: Use ES6 imports with `.js` extensions for local files
- **Error Handling**: Always handle errors appropriately
- **Logging**: Use the existing logging system for debugging

## Commit Message Format

Use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Pull Request Guidelines

- **One feature per PR**
- **Clear description** of changes
- **Test your changes** thoroughly
- **Update documentation** if needed
- **Keep commits clean** and atomic

## Questions?

Feel free to open an issue for any questions about contributing!

---

Thank you for helping make Gemini ChatBot better! 🤖✨
