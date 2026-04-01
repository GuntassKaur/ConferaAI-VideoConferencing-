# Confera AI - Enterprise-Grade AI Video Conferencing

**Confera AI** is a next-generation, elite video conferencing platform designed for modern enterprises. Built with a stunning Microsoft-level UI/UX, it leverages deep AI integration to transform meetings into actionable intelligence.

![Confera AI Dashboard](/hero-v2.png) (Mock)

## ✨ Enterprise Features

- **💎 Microsoft-Level UX**: Futuristic glassmorphism, fluid Framer Motion animations, and custom Fluent-inspired design system.
- **🧠 5-Minute AI Recap**: Instant meeting insights and summaries powered by structured AI analysis.
- **⏱️ Smart Timeline**: A visual index of meeting highlights, decisions, and action items with keyword search.
- **💬 Live Engagement**: Real-time emoji reactions, interactive polls, and AI-generated icebreakers.
- **🌐 Global Collaboration**: Live transcription and instant translation hooks for multi-language conferences.
- **🚪 AI Breakout Rooms**: Automated participant grouping based on role and expertise with dedicated AI moderators.
- **🎨 Infinite Whiteboard**: Collaborative drawing space with vector tools and project export.
- **🔒 Enterprise Security**: End-to-end encrypted signaling and secure session management.
  - **Adaptive AI**: Smart background noise cancellation and adaptive video quality.
  - **Security**: Military-grade end-to-end encryption (E2EE).
  - **Performance**: High-speed WebRTC signaling and scalable Node.js backend.
  - **Compliance**: Built for enterprise-level privacy and global standards.

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Real-time**: [Socket.io Client](https://socket.io/), [PeerJS](https://peerjs.com/)

### Backend
- **Core**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Real-time**: [Socket.io](https://socket.io/)
- **Signaling**: PeerJS Server integration
- **AI**: [OpenAI SDK](https://openai.com/)

## 🛠️ Local Setup

### 1. Backend Server
```bash
cd server
npm install
# Configure your .env
npm start
```

### 2. Frontend Client
```bash
cd client
npm install
npm run dev
```

## 🌐 Environment Variables

### Server (`/server/.env`)
- `OPENAI_API_KEY`: Your OpenAI API key for recaps/insights.
- `FRONTEND_URL`: URL of your deployed client for CORS.
- `PORT`: (Default: 5000)

### Client (`/client/.env.local`)
- `NEXT_PUBLIC_SOCKET_URL`: URL of your deployed server.

---

Built for **Elite Collaboration** and **High-Performance Teams**.
**Confera AI** - The Future of Meetings is Intelligent.
