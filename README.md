# MediBot - AI Assistant Chatbot

MediBot is a React-based AI assistant chatbot application built with TypeScript and Vite. It provides an interactive interface for users to ask questions and receive responses from an AI assistant. The project features a clean and responsive UI, leveraging modern web development tools and libraries.

## Features

- **Interactive Chat Interface**: Users can send messages and receive responses from the AI assistant.
- **Document Upload Component**: A placeholder for future functionality to upload documents.
- **Responsive Design**: The layout adapts to different screen sizes.
- **Customizable Sidebar**: Includes a sidebar with a logo, subtitle, and list of items.
- **Modern Tech Stack**: Built with React, TypeScript, and Vite for fast development and performance.

## Project Structure

```
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
└── src/
    ├── App.css
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── MainScreen.tsx
    ├── vite-env.d.ts
    ├── assets/
    │   ├── arrow_back.svg
    │   ├── new_chat.svg
    │   ├── react.svg
    │   └── send.svg
    └── components/
        ├── chatbot.tsx
        ├── compStyles.css
        └── SearchBar.tsx
```

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/medibot.git
   cd medibot
   ```

2. **Install Dependencies**:
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Visit `http://localhost:5173` to view the application.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Technologies Used

- **Frontend**: React, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS
- **Linting**: ESLint
- **Icons**: SVG assets

## Components

### 1. `MainScreen.tsx`
- The main layout of the application, including the sidebar and chat interface.
- Contains the "CAZE LABS" logo, "MediBot" subtitle, and a placeholder for document upload.

### 2. `chatbot.tsx`
- Implements the chat interface where users can interact with the AI assistant.
- Features a scrollable message area and an input field for sending messages.

### 3. `SearchBar.tsx`
- A reusable search bar component with customizable placeholder text and search functionality.

## Assets

- **`arrow_back.svg`**: Used for navigation or back functionality.
- **`new_chat.svg`**: Represents the "New Chat" feature.
- **`react.svg`**: Icon for the chatbot.
- **`send.svg`**: Icon for the send button in the chat interface.

## Future Enhancements

- Add functionality to the "Document Upload" component.
- Integrate a backend API for dynamic AI responses.
- Improve the UI/UX with animations and transitions.
- Add unit tests for components.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/).
- Icons sourced from the project's `assets` folder.

---

Feel free to customize this `README.md` further to suit your needs!

