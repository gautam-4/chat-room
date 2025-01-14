'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useSocket } from '../context/SocketProvider';

export default function Page() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black p-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-gray-500" />
          <h1 className="text-xl font-semibold text-gray-200">All Messages</h1>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-black">
        {/* Message content would go here */}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-800 bg-black p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 rounded-lg bg-gray-900 border-none px-4 py-2 text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}