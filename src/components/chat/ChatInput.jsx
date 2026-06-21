import React, { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';

const ChatInput = () => {
  const { sendMessage, isLoading } = useChatContext();
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;
    sendMessage(content);
    setContent('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 flex items-end">
      <textarea
        className="flex-1 resize-none bg-gray-50 dark:bg-gray-800 rounded p-2 focus:outline-none"
        rows={1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your company policies..."
        disabled={isLoading}
      />
      <button 
        type="submit" 
        disabled={!content.trim() || isLoading}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;