# Chat App 💬

A real-time chat application built with React, Node.js, WebSockets, and TypeScript.

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **WebSocket Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **TypeScript** - Server-side type safety
- **WebSockets** - Real-time bidirectional communication

## 📁 Project Structure

```
Chat-App/
├── chat-app-frontend/          # React frontend application
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── App.tsx            # Main React component
│   │   ├── App.css            # Styles
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Base styles
│   ├── public/                # Public assets
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   └── .gitignore             # Frontend ignore rules
│
├── chat-app-backend/           # Node.js backend server
│   ├── src/
│   │   └── index.ts           # Server entry point
│   ├── dist/                  # Compiled JavaScript (generated)
│   ├── package.json           # Backend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   └── .gitignore             # Backend ignore rules
│
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sk8infinity18/Chat-App.git
   cd Chat-App
   ```

2. **Install backend dependencies**
   ```bash
   cd chat-app-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../chat-app-frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd chat-app-backend
   npm run dev
   ```

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd chat-app-frontend
   npm run dev
   ```

3. **Open your browser** at `http://localhost:5173`

