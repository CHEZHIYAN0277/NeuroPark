import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Update if hosted

let socket: any;

export const useLiveSlotUpdates = () => {
  const [liveSlots, setLiveSlots] = useState<any[]>([]);

  useEffect(() => {
    socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('slotStatusUpdated', (updatedSlot) => {
      setLiveSlots((prev) => {
        const exists = prev.find((s) => s._id === updatedSlot._id);
        if (exists) {
          return prev.map((s) => (s._id === updatedSlot._id ? updatedSlot : s));
        } else {
          return [...prev, updatedSlot];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { liveSlots };
};
