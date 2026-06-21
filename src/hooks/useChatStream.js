import { useState } from "react";

let currentWorkspaceId = null;
let currentConversationId = null;

export const setWorkspaceId = (id) => {
  currentWorkspaceId = id;
};

export const setConversationId = (id) => {
  currentConversationId = id;
};

export const useChatStream = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const setInitialMessages = (initialMsgs) => setMessages(initialMsgs);

  const editPrompt = async (
    msgId,
    newText,
    category = "All",
    toolModifier = null,
  ) => {
    const msgIndex = messages.findIndex((m) => m.id === msgId);
    if (msgIndex === -1) return;

    const historyUpToNow = messages.slice(0, msgIndex);
    setMessages(historyUpToNow);

    await askWithHistory(newText, category, toolModifier, historyUpToNow);
  };

  const ask = async (question, category = "All", toolModifier = null) => {
    await askWithHistory(question, category, toolModifier, messages);
  };

  const askWithHistory = async (
    question,
    category,
    toolModifier,
    currentHistory,
  ) => {
    setLoading(true);

    const userMsgId = Date.now();
    const userMsg = { id: userMsgId, isAi: false, text: question };

    const assistantMsgId = Date.now() + 1;
    const assistantMsgPlacement = {
      id: assistantMsgId,
      isAi: true,
      text: "",
      citations: [],
    };

    setMessages((prev) => [...prev, userMsg, assistantMsgPlacement]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080/api"}/query/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...(currentWorkspaceId
              ? { "x-workspace-id": currentWorkspaceId }
              : {}),
          },
          body: JSON.stringify({
            question: question,
            category,
            toolModifier,
            history: currentHistory.map((m) => ({
              isAi: m.isAi,
              text: m.text,
            })),
            conversationId: currentConversationId,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("BACKEND RESPONSE ERROR:", errorText);
        throw new Error(errorText || "Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let assistantText = "";
      let accumulatedCitations = [];
      let newConversationId = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        while (buffer.includes("\n\n")) {
          const nextNewline = buffer.indexOf("\n\n");
          const chunk = buffer.slice(0, nextNewline).trim();
          buffer = buffer.slice(nextNewline + 2);

          if (chunk.startsWith("data: ")) {
            const dataStr = chunk.slice(6).trim();
            if (dataStr === "[DONE]") {
              continue;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === "citations") {
                accumulatedCitations = parsed.data;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, citations: parsed.data }
                      : msg,
                  ),
                );
              } else if (parsed.type === "content") {
                assistantText += parsed.data;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, text: assistantText }
                      : msg,
                  ),
                );
              } else if (parsed.type === "conversationId") {
                newConversationId = parsed.data;
                currentConversationId = newConversationId;
              }
            } catch (e) {
              console.error("Failed parsing stream chunk", dataStr);
            }
          }
        }
      }

      // Stream done — refresh sidebar
      window.dispatchEvent(new CustomEvent("conversationUpdated"));
    } catch (error) {
      console.error("Streaming Error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                text: `Error: ${error.message || "Failed to get an answer. Check API Quota."}`,
              }
            : msg,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    setInitialMessages,
    ask,
    editPrompt,
    loading,
  };
};
