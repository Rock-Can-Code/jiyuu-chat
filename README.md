# Jiyuu Chat

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Rock-Can-Code/jiyuu-chat)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Contributors](https://img.shields.io/github/contributors/Rock-Can-Code/jiyuu-chat)](https://github.com/Rock-Can-Code/jiyuu-chat/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/Rock-Can-Code/jiyuu-chat)](https://github.com/Rock-Can-Code/jiyuu-chat/commits/develop)
[![Issues](https://img.shields.io/github/issues/Rock-Can-Code/jiyuu-chat)](https://github.com/Rock-Can-Code/jiyuu-chat/issues)


Welcome to **Jiyuu Chat**, an open-source repository for a cutting-edge AI-powered chat application. This project is built using **Next.js** and integrates advanced machine learning models to deliver a seamless conversational experience. Designed for scalability and performance, **Jiyuu Chat** is a collaborative effort by the **Rock Can Code** community to push the boundaries of AI-driven communication.

Our goal is to provide a platform that is not only functional but also easy to extend, customize, and deploy. Whether you're a developer looking to contribute or a user exploring the potential of AI, **Jiyuu Chat** is the perfect starting point.

---

## ✅ Feature Progress

Here's an overview of current and upcoming features being developed in **Jiyuu Chat**:

### ✔️ Completed
- [x] **Load Model** – Ability to load and initialize an AI model for chatting.
- [x] **Clean Chat** – Option to clear the conversation history easily.
- [x] **Choose Model: Llama-3.2-1B** – User can select the Llama-3.2-1B model for interaction.
- [x] **AI-Powered Conversations** – Leverages state-of-the-art machine learning models for natural and engaging interactions.
- [x] **Customizable Themes** – Easily switch between light and dark modes or customize the UI to fit your needs.
- [x] **Real-Time Streaming** – Supports real-time message streaming for a responsive chat experience.
- [x] **Code Highlighting** – Automatically formats and highlights code snippets shared in the chat.
- [x] **Mobile-Responsive Design** – Fully optimized for both desktop and mobile devices.
- [x] **Open Source** – Built by the community, for the community.

### ⏳ In Progress / Planned
- [ ] **Choose Model: Mistral-Small-3.1-24B** – Add support to select the Mistral-Small-3.1-24B model.
- [ ] **Enhance [WebLLM (mlc-ai)](https://github.com/mlc-ai/mlc-llm) Compilation** – Contribute to fixing bugs in the compilation of custom models for WebGPU.
- [ ] **[Transformers.js](https://github.com/huggingface/transformers.js/) Large LLM Support** – Contribute to extending support for larger models in the `transformers.js` framework.
- [ ] **Load Uncensored Model** – Integrate support for uncensored LLMs for broader AI use cases.

---

## 🚀 Installation and Project Setup

To set up the project in your local environment, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rock-Can-Code/jiyuu-chat.git
   cd jiyuu-chat
   ```
2. **Install dependencies:**
   Make sure you have **Node.js** (recommended version 18.x or higher) and **npm** or **yarn** installed.
   
   - [Download Node.js](https://nodejs.org/)
   - Install project dependencies:
     ```bash
     npm install
     ```

3. **Start the development environment:**
   ```bash
   npm run dev
   ```
   The project will run at `http://localhost:3000`.

4. **Verify everything is working correctly before starting development.**

---

## 📌 Branch Strategy

The project follows a **Git Flow** strategy with adaptations for a "pre" branch. The main branches are:

- **`main`** → Contains stable production code.
- **`develop`** → Main development branch with integrated code.
- **`pre`** → (Optional) For testing before merging into `main`, if requested by the pre team.
- **`feature/*`** → For developing new features.
- **`bugfix/*`** → For fixing bugs in `develop`.
- **`hotfix/*`** → For urgent fixes in `main`.

**Recommended Workflow:**
1. Open an **issue** in the repository to discuss the task with the team.
2. If the task is approved, it will be assigned to you, and you can create a branch `feature/feature-name`, `bugfix/bug-name`, or `hotfix/hotfix-name` based on `develop` or `main`, as appropriate.
3. Develop and ensure you follow the code conventions.
4. Open a Pull Request (PR) to `develop` when ready.
5. The code will be reviewed and tested before being merged.

---

## 🎨 Style Guide

To maintain clean and consistent code, we follow these rules:

- **Code Formatting:** We use `Prettier` for automatic formatting.
- **Commits:** We follow the [Conventional Commits](https://www.conventionalcommits.org/) convention:
  - `feat: new feature`
  - `fix: bug fix`
  - `chore: minor changes with no functional impact`
- **Naming:** Variable and function names are in English and use camelCase.
- **Style Guide:** We base our rules on the [Google Style Guide](https://google.github.io/styleguide/) for coding standards and best practices.

---

## 📚 Documentation

### **Core Components**
- **Chat Interface**: The main UI for user interactions.
- **AI Engine Integration**: Connects to machine learning models for generating responses.
- **Markdown Rendering**: Supports rich text formatting, including headings, lists, and code blocks.

### **Key Files**
- `src/app/page.tsx`: The main entry point for the chat application.
- `src/components`: Contains reusable UI components.
- `src/styles`: Includes global and component-specific styles.

For detailed documentation, visit the [Wiki](https://github.com/Rock-Can-Code/jiyuu-chat/wiki).

---

## 🤝 How to Contribute

If you want to collaborate on the project, follow these steps:

1. **Open an issue in the repository to propose your contribution.**
2. **If the task is approved, it will be assigned to you, and a branch will be created for your change.** Switch to this branch to implement your contribution.
   ```bash
   git checkout [feature - bugfix]/[name]
   ```
3. **Make your changes and ensure they comply with the code standards.**
4. **Commit your changes following the mentioned convention.**
5. **Push your branch and open a Pull Request on GitHub.**
6. **A team reviewer will review your code and provide feedback.**

---

## 🔒 Security and Contribution Rules

- PRs must be reviewed and approved before being merged.
- Direct `push` to `main` or `develop` is not allowed.
- Automated tests are run on every PR.
- In case of vulnerabilities, report them directly to the maintenance team.

---

## 📄 License

This project is under the **MIT** license, which means you can freely use, modify, and share it, as long as you give credit to the authors.

---

Thank you for being part of **Jiyuu Chat**! 🎉💬