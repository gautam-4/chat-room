'use client'

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useSocket } from '../context/SocketProvider';
import { format } from 'date-fns';

export default function Page() {
  const { sendMessage, messages, isConnected } = useSocket();
  const [message, setMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4 shadow-lg">
        <div className="flex items-center gap-3 max-w-screen-lg mx-auto">
          <MessageCircle className="h-6 w-6 text-indigo-400" />
          <h1 className="text-xl font-bold text-white">Chat</h1>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
        <div className="max-w-screen-lg mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="group animate-fade-in">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 transform transition-all duration-200 hover:bg-gray-800/70">
                <p className="text-gray-100 break-words">{msg.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-gray-400">
                    {format(new Date(msg.createdAt), 'HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-screen-lg mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg bg-gray-800/50 border-2 border-gray-700 px-4 py-3 text-gray-100 placeholder-gray-500 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none
                transition-all duration-200"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white
                hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                focus:ring-offset-gray-900 transform transition-all duration-200 hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
              <span className='hidden md:block'>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}