// src/hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5001'; // Use env var in production

export const useSocket = (onSlotUpdate: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'], // optional for better perf
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket:', socket.id);
    });

    socket.on('slotUpdated', (slot) => {
      console.log('📡 Slot updated via WebSocket:', slot);
      onSlotUpdate(slot);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket');
    });

    return () => {
      socket.disconnect();
    };
  }, [onSlotUpdate]);
};
