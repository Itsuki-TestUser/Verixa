import React, { useState, useRef, useEffect } from "react";
import SEO from "../components/SEO";
import ChatMessage from "../components/ChatMessage";
import { Send } from "lucide-react";
import { useAppStore } from "../hooks/useAppStore";
import { useChatStream, setConversationId } from "../hooks/useChatStream";

const ChatSkeleton = () => (
  <div className="flex-1 overflow-y-auto">
    <div className="max-w-3xl mx-auto w-full px-4 md:px-6 py-8 space-y-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`rounded-2xl p-4 animate-pulse ${i % 2 === 0 ? "bg-white dark:bg-slate-800 w-3/4" : "bg-[#ecf2fe] w-1/2"}`}
          >
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const initialMessages = [
  {
    id: 1,
    isAi: true,
    text: "Hello! I am your Verixa AI Assistant. How can I help you today?",
    citations: [],
  },
];

const Chat = () => {
  const {
    messages,
    setMessages,
    setInitialMessages,
    ask,
    editPrompt,
    loading: isTyping,
  } = useChatStream();
  const [input, setInput] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const endOfMessagesRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { filter, globalSearchQuery, setGlobalSearchQuery } = useAppStore();
  const [modifier, setModifier] = useState("");

  useEffect(() => {
    setInitialMessages(initialMessages);
  }, []);

  useEffect(() => {
    const handleLoadConversation = (event) => {
      setIsLoadingChat(true);
      const { messages: savedMessages, conversationId } = event.detail;
      setTimeout(() => {
        setMessages(savedMessages);
        setConversationId(conversationId);
        setIsLoadingChat(false);
      }, 300);
    };
    const handleNewChat = () => {
      setMessages(initialMessages);
      setConversationId(null);
    };
    window.addEventListener("loadConversation", handleLoadConversation);
    window.addEventListener("newChat", handleNewChat);
    return () => {
      window.removeEventListener("loadConversation", handleLoadConversation);
      window.removeEventListener("newChat", handleNewChat);
    };
  }, [setMessages]);

  useEffect(() => {
    if (globalSearchQuery) {
      const q = globalSearchQuery;
      setGlobalSearchQuery(null);
      setTimeout(() => ask(q, filter, null), 100);
    }
  }, [globalSearchQuery]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 250;
      if (isNearBottom || isTyping) {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    const query = input.trim();
    setInput("");
    await ask(query, filter, modifier || null);
  };

  const handleAction = async (actionType) => {
    if (isTyping) return;
    if (actionType === "explain_5") {
      await ask(
        "Please explain the previous response to me clearly, as if I were a 5 year old.",
        filter,
        "Explain this to me like I am a 5 year old.",
      );
    } else if (actionType === "quiz") {
      await ask(
        "Based on the previous response, generate a short 10-question multiple choice quiz.",
        filter,
        null,
      );
    }
  };

  const handleEditMessage = async (msgId, newText) => {
    if (isTyping) return;
    await editPrompt(msgId, newText, filter, modifier || null);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      <SEO
        title="Chat | Verixa AI"
        description="Search, analyze and chat with your documents using Verixa AI."
      />
      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        {isLoadingChat ? (
          <ChatSkeleton />
        ) : (
          <div className="max-w-3xl mx-auto w-full px-4 md:px-6 py-4 md:py-8">
            <div className="flex flex-col gap-6 pb-20">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  isLast={index === messages.length - 1}
                  isTyping={isTyping && index === messages.length - 1}
                  onEdit={handleEditMessage}
                  onAction={handleAction}
                />
              ))}
              <div ref={endOfMessagesRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-gradient-to-t from-white via-white dark:from-slate-950 dark:via-slate-950 to-transparent px-3 md:px-6 pb-4 md:pb-6 pt-2">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto">
          <div className="flex justify-end mb-2">
            <select
              value={modifier}
              onChange={(e) => setModifier(e.target.value)}
              className="text-[11px] md:text-xs px-2 md:px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border-0 outline-none cursor-pointer"
            >
              <option value="">💬 Auto</option>
              <option value="Explain this to me like I am a 5 year old.">
                👶 Simple
              </option>
              <option value="Format the response as a valid JSON object.">
                🔧 JSON
              </option>
              <option value="Be extremely concise, provide only the direct answer.">
                ⚡ Concise
              </option>
              <option value="Format the response entirely as a Markdown Table.">
                📊 Table
              </option>
            </select>
          </div>

          <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl md:rounded-3xl px-3 md:px-5 py-2 md:py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything..."
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm md:text-base text-slate-700 dark:text-slate-200 placeholder-slate-400 py-1 max-h-32"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 md:p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-full transition-colors shrink-0"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          <p className="text-center text-[10px] md:text-xs text-slate-400 mt-2 md:mt-3">
            Verixa AI can make mistakes. Verify important information.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Chat;
