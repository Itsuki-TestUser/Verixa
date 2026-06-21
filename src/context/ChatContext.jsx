import React, { createContext, useContext, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const chatState = useChat();

  useEffect(() => {
    chatState.fetchChats();
  }, [chatState]);

  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  );
};
