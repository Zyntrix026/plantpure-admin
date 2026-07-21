import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5100';

// Single shared socket instance across the whole app
let sharedSocket = null;

export const getSocket = () => {
  if (!sharedSocket || sharedSocket.disconnected) {
    sharedSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    sharedSocket.on('connect', () =>
      console.log('[SOCKET] Connected:', sharedSocket.id)
    );
    sharedSocket.on('disconnect', (reason) =>
      console.log('[SOCKET] Disconnected:', reason)
    );
    sharedSocket.on('connect_error', (err) =>
      console.error('[SOCKET] Connection error:', err.message)
    );
  }
  return sharedSocket;
};

/**
 * useSocket — attach named event listeners to the shared socket.
 * Handlers are stored in a ref so they always have fresh closure values
 * without needing to re-register on every render.
 *
 * Usage:
 *   useSocket({ fb_new_message: (data) => { ... } });
 */
export const useSocket = (eventHandlers) => {
  const handlersRef = useRef(eventHandlers);
  handlersRef.current = eventHandlers;

  useEffect(() => {
    const socket = getSocket();

    // Stable wrapper functions that delegate to the latest handler ref
    const wrappers = {};
    Object.keys(handlersRef.current).forEach((event) => {
      wrappers[event] = (...args) => handlersRef.current[event]?.(...args);
      socket.on(event, wrappers[event]);
    });

    return () => {
      Object.keys(wrappers).forEach((event) => {
        socket.off(event, wrappers[event]);
      });
    };
  }, []); // runs once on mount, cleans up on unmount
};
