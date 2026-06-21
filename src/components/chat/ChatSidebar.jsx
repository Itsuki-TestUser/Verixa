import React from 'react';
import { useChatContext } from '../../context/ChatContext';

const ChatSidebar = () => {
  const { chats, currentChat, selectChat, createChat, deleteChat } = useChatContext();

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r h-full flex flex-col p-4">
      <button onClick={createChat} className="bg-blue-600 text-white rounded py-2 px-4 mb-4">
        + New Chat
      </button>
      <div className="flex-1 overflow-auto">
        {chats.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No conversations yet</p>
        ) : (
          chats.map(chat => (
            <div 
              key={chat._id} 
              onClick={() => selectChat(chat._id)}
              className={`p-3 mb-2 rounded cursor-pointer ${currentChat?._id === chat._id ? 'bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div className="font-semibold truncate">{chat.title}</div>
              <div className="text-xs text-gray-500">{new Date(chat.lastMessageAt).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
