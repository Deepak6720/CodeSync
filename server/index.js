const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const http = require('http');
const { WebSocketServer } = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const messageRoutes = require('./routes/messageRoutes');
const executeRoutes = require('./routes/executeRoutes');
const fileRoutes = require('./routes/fileRoutes');
const snapshotRoutes = require('./routes/snapshotRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  express.json({
    limit: '1mb',
  })
);

app.use(passport.initialize());

app.use(generalLimiter);

app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/rooms', messageRoutes);
app.use('/execute', executeRoutes);
app.use('/files', fileRoutes);
app.use('/snapshots', snapshotRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'CodeSync API is running!',
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);

  if (err.message?.includes('CORS')) {
    return res.status(403).json({
      message: 'CORS: Origin not allowed',
    });
  }

  res.status(500).json({
    message: 'Internal server error',
  });
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req, { gc: true });
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

const initializeSocket = require('./socket/socketHandler');
initializeSocket(io);

const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`REST API: ${BASE_URL}`);
  console.log(`Yjs WebSocket: ${BASE_URL}`);
  console.log(`Socket.IO: ${BASE_URL}`);
  console.log('Security: Rate limiting + Zod validation active');
});