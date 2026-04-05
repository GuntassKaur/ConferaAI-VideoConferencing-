require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Store active meetings
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, userId, userName }) => {
    socket.join(roomId);
    console.log(`User ${userName} (${userId}) joined room ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', { userId, userName, socketId: socket.id });
    
    // Handle room state
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: [], transcript: [], startTime: Date.now() });
    }
    const room = rooms.get(roomId);
    
    // Return existing users to the new joiner
    const existingUsers = room.users.map(u => u.socketId).filter(id => id !== socket.id);
    socket.emit('all-users', existingUsers);

    room.users.push({ userId, userName, socketId: socket.id });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      socket.to(roomId).emit('user-left', { userId, socketId: socket.id });
      if (rooms.has(roomId)) {
        const r = rooms.get(roomId);
        r.users = r.users.filter(u => u.socketId !== socket.id);
        if (r.users.length === 0) rooms.delete(roomId);
      }
    });
  });

  // Signaling for WebRTC
  socket.on('signal', ({ to, signal, from }) => {
    io.to(to).emit('signal', { signal, from });
  });

  // Chat message
  socket.on('send-message', ({ roomId, message, userName, userId }) => {
    io.to(roomId).emit('receive-message', { message, userName, userId, timestamp: new Date() });
  });

  // AI Insights - Mock for now
  socket.on('request-ai-insight', async ({ roomId, text }) => {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        const insight = `🔍 AI Mock Insight: We should discuss "${text.substring(0, 20)}..."`;
        io.to(roomId).emit('ai-insight', { insight });
        return;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI meeting assistant. Generate a short, one-sentence insight based on this snippet of conversation." },
          { role: "user", content: text }
        ],
      });

      const insight = `✨ AI: ${response.choices[0].message.content}`;
      io.to(roomId).emit('ai-insight', { insight });
    } catch (error) {
      console.error('AI Error:', error);
    }
  });
});

app.post('/api/generate-summary', async (req, res) => {
  const { transcript } = req.body;
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.json({ summary: "Mock Summary: Key decisions were made regarding the UI. Next sync at 10 AM.", keyPoints: ["Design overhaul", "Production deployment"] });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Summarize this meeting transcript and provide key bullet points." },
        { role: "user", content: transcript.join(' ') }
      ],
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Confera AI Backend' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
