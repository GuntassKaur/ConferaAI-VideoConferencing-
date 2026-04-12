require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
// Frontend URL is expected to be either Vercel URL or localhost
const FRONTEND_URL = process.env.CLIENT_URL || process.env.FRONTEND_URL || '*';

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

// Critical: Set up Socket.IO properly for CORS and Polling fallback
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Allow fallback for Vercel/proxies
});

// Store active meetings: roomId -> { users: { socketId: userId } }
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected - Socket ID:', socket.id);

  // 1. Join Room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    socket.join(roomId);
    console.log(`User ${userName} (${userId}) joined room ${roomId}`);
    
    // Initialize room if doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: {} });
    }
    const room = rooms.get(roomId);
    room.users[socket.id] = { userId, userName };

    // Get list of other users to send to the new joiner
    const otherUsers = Object.keys(room.users).filter(id => id !== socket.id);
    
    // Tell the new user about existing users
    socket.emit('all-users', otherUsers);

    // Tell others that a new user connected
    socket.to(roomId).emit('user-connected', {
      userId,
      userName,
      socketId: socket.id
    });

    // 2. Disconnect Handler
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      socket.to(roomId).emit('user-disconnected', socket.id);
      
      const r = rooms.get(roomId);
      if (r) {
        delete r.users[socket.id];
        if (Object.keys(r.users).length === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });

  // 3. WebRTC Signaling: Offer
  socket.on('offer', payload => {
    io.to(payload.userToSignal).emit('offer', {
      signal: payload.signal,
      callerId: payload.callerId
    });
  });

  // 4. WebRTC Signaling: Answer
  socket.on('answer', payload => {
    io.to(payload.callerId).emit('answer', {
      signal: payload.signal,
      id: socket.id
    });
  });

  // 5. WebRTC Signaling: ICE Candidate
  socket.on('ice-candidate', payload => {
    io.to(payload.targetId).emit('ice-candidate', {
      candidate: payload.candidate,
      senderId: socket.id
    });
  });

  // Chat message broadcasting
  socket.on('send-message', ({ roomId, message, userName }) => {
    io.to(roomId).emit('receive-message', { 
      message, 
      userName, 
      timestamp: new Date() 
    });
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Confera AI Socket Server' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
