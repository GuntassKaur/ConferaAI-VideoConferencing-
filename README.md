# Confera AI - Enterprise-Grade AI Video Conferencing

**Confera AI** is a next-generation, elite video conferencing platform designed for modern enterprises. Built with a stunning Microsoft-level UI/UX, it leverages deep AI integration to transform meetings into actionable intelligence.

![Confera AI Dashboard](/hero-v2.png) (Mock)

## ✨ Premium Features

- **Stunning UI/UX**: Futuristic theme with glassmorphism, fluid animations (Framer Motion), and intuitive navigation.
- **AI Intelligence**:
  - **5-Minute Recap**: Instant automated summaries of every meeting segment.
  - **Live Transcription**: Real-time multi-language transcription and translation.
  - **Meeting Insights**: Searchable highlights timeline with keyword indexing.
  - **Adaptive AI**: Smart background noise cancellation and adaptive video quality.
- **Collaboration Suite**:
  - **Infinite Whiteboard**: Real-time collaborative canvas for visual planning.
  - **Breakout Rooms**: Controlled environments with AI moderators.
  - **Engagement Boosters**: Emoji reactions, instant polls, and AI-generated icebreakers.
- **Enterprise Grade**:
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
