'use client'
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  createdAt: Date;
}

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => void;
  messages: Message[];
  isConnected: boolean;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error('state is undefined');
  return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback((msg: string) => {
    if (socket && msg.trim()) {
      socket.emit('event:message', { message: msg });
    }
  }, [socket]);

  useEffect(() => {
    const _socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000');

    _socket.on('connect', () => {
      setIsConnected(true);
    });

    _socket.on('disconnect', () => {
      setIsConnected(false);
    });

    _socket.on('event:messages', (messages: Message[]) => {
      setMessages(messages);
    });

    _socket.on('event:newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    _socket.on('event:error', (error: string) => {
      console.error('Socket error:', error);
    });

    setSocket(_socket);

    return () => {
      _socket.disconnect();
      setSocket(undefined);
    }
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}