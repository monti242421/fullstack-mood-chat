# MoodChat 💬🎭

**MoodChat** is a full-stack, real-time chat application enhanced with **emotion detection** and **AI-powered suggestions**, enabling a dynamic, immersive chatting experience. The application analyzes the tone of conversations and changes its theme accordingly — while offering smart reply suggestions for users.

Live Demo 👉 [MoodChat App](https://fullstack-emotions-chat.web.app/login)  
GitHub Repo 👉 [Source Code](https://github.com/monti242421/fullstack-mood-chat)

---

## 🔧 Tech Stack

### 🧠 Frontend
- React.js
- Redux Toolkit
- Socket.io Client
- JWT Authentication
- Emotion-Based UI & Stickers
- Firebase Hosting

### 🛠️ Backend
- Node.js
- Express.js
- Socket.io
- Mistral LLM Integration (via prompt engineering)
- JWT Token Auth
- Google Cloud Run Deployment

### 📦 Database
- MySQL

---

## 💡 Key Features

- ✅ **Real-time Chat** using WebSockets via Socket.io  
- 🎭 **Emotion Detection** using Mistral LLM to analyze chat sentiment  
- 🎨 **Dynamic Theme Switching** based on detected emotion (happy, sad, love, calm, angry, neutral)  
- 🧠 **AI-Powered Smart Replies** for both users in chat  
- 🔐 **Secure Authentication** using JWT tokens  
- 🗃️ **Redux-Powered State Management**  
- 🖼️ **Sticker Rendering** transitions tied to mood state  
- 🚀 **Fully deployed** using Google Cloud Run & Firebase

---

## ⚙️ How It Works

> See full architecture diagram  here → [MoodChat Architecture](uploaded on main branch)

1. **User Authentication**
   - Users sign up or log in with JWT-secured routes.
   - Redux store is populated with user & token.

2. **Socket Connection**
   - On app load, socket connects, registers user, and pulls online user list + chat history.
   - Messages and online status are live via WebSocket events.

3. **Chat Creation & Messaging**
   - Each chatbox is uniquely created with a composite user ID.
   - Messages are stored in MongoDB per chatbox and reflected in Redux.

4. **Emotion & Theme Detection**
   - Every few messages, conversations are sent to **Mistral LLM**.
   - A single prompt returns:  
     - `mood` → used for dynamic theme  
     - `summary` → conversational overview  
     - `smartReplies` → context-aware reply suggestions

5. **Fallback System**
   - If LLM fails or response is ambiguous, fallback rules provide:
     - Default mood
     - Safe replies and themes

6. **UI Reactivity**
   - All UI updates — online status, messages, stickers, themes — are driven by Redux store and updated instantly.

---

## 🛠️ Setup Instructions

```bash
# Clone project
git clone https://github.com/monti242421/fullstackIntentDetection.git

# Frontend setup
cd client/Emotional_Chatbot
npm install
npm run dev

# Backend setup
cd ../server
npm install
npm start



Built by Tarun Kumar
