# Confera AI - Next-Gen Video Conferencing

Elite AI-native video conferencing platform with real-time transcription, automated meeting summaries, and a premium glassmorphic UI.

## 🚀 Project Structure
- `/client`: React + Vite + Tailwind + Framer Motion
- `/server`: Node.js + Socket.io + Express + PeerJS

## 🛠️ Features
- **Working Video/Audio**: Real-time WebRTC streams with signaling.
- **AI Insights**: Live meeting observations (OpenAI powered).
- **Meeting Summary**: Post-meeting intelligence.
- **Premium UI**: Glassmorphism, smooth animations, dark-themed dashboard.
- **Fully Responsive**: Works on all devices.

## 📦 Local Setup

### 1. Server
```bash
cd server
npm install
# Create .env with OPENAI_API_KEY
npm start
```

### 2. Client
```bash
cd client
npm install
npm run dev
```

## 🌐 Deployment

### Client (Vercel)
1. Push `client/` to GitHub.
2. Connect to Vercel.
3. Set `VITE_BACKEND_URL` env variable.

### Server (Render)
1. Push `server/` to GitHub.
2. Deploy as Web Service on Render.
3. Set `OPENAI_API_KEY` and `FRONTEND_URL`.

---
Built for the Hackathon Winning Experience.
