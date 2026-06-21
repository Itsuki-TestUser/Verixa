import React from 'react';
import { useChatContext } from '../../context/ChatContext';

const ChatWindow = () => {
  const { messages, isLoading, error } = useChatContext();

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-950 flex flex-col space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">Error: {error.message} <button className="underline ml-2">Retry</button></div>}
      
      {messages.length === 0 && !isLoading && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>Ask a question about your documents</p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`p-4 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
            <p>{msg.content}</p>
            {msg.citations?.length > 0 && (
              <div className="mt-2 text-xs opacity-80 border-t pt-2">
                <strong>Citations:</strong>
                {msg.citations.map((c, i) => (
                  <div key={i}>[{c.page}] {c.fileName}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="self-start p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500">
          Typing...
        </div>
      )}
    </div>
  );
};

export default ChatWindow;