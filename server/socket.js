// server/socket.js
import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // set your frontend URL here for production
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('WebSocket connected:', socket.id);
  });
};

export { io };
