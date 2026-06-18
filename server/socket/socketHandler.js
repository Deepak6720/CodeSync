const { saveMessage } = require('../controllers/messageController');
const initializeSocket = (io) => {
    io.on('connection', (socket) => {
      console.log(`⚡ Socket connected: ${socket.id}`);
      socket.on('join-room', ({ roomId, user }) => {
        socket.join(roomId);
        // Store user info on the socket object itself
        // We need this when they disconnect (no data sent on disconnect)
        socket.roomId = roomId;
        socket.user = user;
  
        console.log(`${user?.name} joined room: ${roomId}`);

        socket.to(roomId).emit('user-joined', {
          userId: user?.id,
          name: user?.name,
          avatar: user?.avatar,
          socketId: socket.id,
        });
      });

      socket.on('language-change', ({roomId, language, changedBy }) => {
        socket.to(roomId).emit('language-changed', {
          language,
          changedBy,
        });
  
        console.log(`Language changed to ${language} in room ${roomId}`);
      });

    socket.on('send-chat-message', async ({ roomId, message }) => {
        // tempId = a temporary client-side ID used to avoid duplicate display
        const savedMessage = await saveMessage({
          roomId,
          senderId: message.senderId,
          content: message.content,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
        });
  
        if (!savedMessage) return;
        io.to(roomId).emit('receive-chat-message', {
          _id: savedMessage._id,
          roomId: savedMessage.roomId,
          senderId: savedMessage.senderId,
          content: savedMessage.content,
          senderName: savedMessage.senderName,
          senderAvatar: savedMessage.senderAvatar,
          createdAt: savedMessage.createdAt,
          tempId: message.tempId, 
        });
      });

      socket.on('code-execution-result', ({ roomId, result }) => {

        io.to(roomId).emit('execution-result', result);
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);

        if (socket.roomId && socket.user) {
          socket.to(socket.roomId).emit('user-left', {
            userId: socket.user.id,
            name: socket.user.name,
            socketId: socket.id,
          });
  
          console.log(`${socket.user.name} left room: ${socket.roomId}`);
        }
      });
  
    });
  
  };
  
  module.exports = initializeSocket;