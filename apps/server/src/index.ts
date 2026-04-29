import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ExpressPeerServer } from 'peer';
import cors from 'cors';
import { validateEnv } from '@confera/shared';

// Environment variable validation can be added here if server specific env variables are needed.
// For now we just import the shared validator as an example.

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// Socket.io Setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// PeerJS Setup
const peerServer = ExpressPeerServer(httpServer, {
  path: '/peerjs'
});
app.use('/peer', peerServer);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const MAX_PARTICIPANTS = 50;
const rooms = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId: string, userId: string) => {
    let roomParticipants = rooms.get(roomId);
    if (!roomParticipants) {
      roomParticipants = new Set();
      rooms.set(roomId, roomParticipants);
    }

    if (roomParticipants.size >= MAX_PARTICIPANTS) {
      socket.emit('room-full');
      return;
    }

    roomParticipants.add(userId);
    socket.join(roomId);
    
    // Broadcast to others in the room
    socket.to(roomId).emit('user-joined', userId);

    socket.on('disconnect', () => {
      roomParticipants?.delete(userId);
      if (roomParticipants?.size === 0) {
        rooms.delete(roomId);
      }
      socket.to(roomId).emit('user-left', userId);
    });

    // Real-time Annotations Sync
    socket.on('annotation-draw', (data) => {
      socket.to(roomId).emit('annotation-draw', data);
    });
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
