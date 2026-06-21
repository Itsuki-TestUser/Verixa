import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Edit2,
  Check,
  Brain,
  Search,
  Sparkles,
  Lightbulb,
  BookOpen,
  HelpCircle,
} from "lucide-react";

const CodeBlock = ({ className, children }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const language = className?.replace("language-", "") || "";

  const handleCopy = () => {
    const codeText =
      codeRef.current?.innerText || codeRef.current?.textContent || "";
    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = codeText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
            copied
              ? "bg-green-900/40 text-green-400"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div ref={codeRef} className="p-4 overflow-x-auto">
        <code className="text-sm leading-relaxed text-slate-200 font-mono whitespace-pre">
          {children}
        </code>
      </div>
    </div>
  );
};

const ChatMessage = ({ msg, isLast, isTyping, onAction, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(msg.text);
  const [copied, setCopied] = useState(false);
  const [thoughtStep, setThoughtStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const messageRef = useRef(null);
  const [initialHeight, setInitialHeight] = useState(40);
  const [initialWidth, setInitialWidth] = useState("auto");

  useEffect(() => {
    let isMounted = true;
    if (msg.isAi && isLast && isTyping && !msg.text) {
      setThoughtStep(0);
      setTimeout(() => isMounted && setThoughtStep(1), 200);
      setTimeout(() => isMounted && setThoughtStep(2), 500);
    }
    return () => {
      isMounted = false;
    };
  }, [msg.isAi, isLast, isTyping, msg.text]);

  const handleCopyMessage = () => {
    // Get text directly from the rendered DOM element
    const msgElement = document.getElementById(`message-${msg.id}`);
    const rawText = msgElement?.innerText || msg.text || "";

    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editedText.trim() && editedText !== msg.text)
      onEdit(msg.id, editedText);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex ${msg.isAi ? "justify-start" : "justify-end"} mb-4 md:mb-6 group`}
    >
      {msg.isAi ? (
        /* AI Message */
        <div className="w-full">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              AI Assistant
            </span>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 md:px-5 md:py-4 shadow-sm">
            {/* BODY */}
            {msg.isAi && isTyping && !msg.text ? (
              <div className="text-sm text-slate-500 space-y-2">
                <div className="text-blue-500">
                  <Brain className="inline w-4 h-4 mr-2" />
                  Understanding question...
                </div>
                {thoughtStep >= 1 && (
                  <div className="text-blue-500">
                    <Search className="inline w-4 h-4 mr-2" />
                    Searching knowledge base...
                  </div>
                )}
                {thoughtStep >= 2 && (
                  <div className="text-blue-500">
                    <Sparkles className="inline w-4 h-4 mr-2" />
                    Generating answer...
                  </div>
                )}
              </div>
            ) : (
              <div
                id={`message-${msg.id}`}
                className="text-sm md:text-[15px] leading-relaxed"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      if (inline) {
                        return (
                          <code
                            className="bg-slate-100 dark:bg-slate-700 text-pink-500 px-1 py-0.5 rounded text-sm"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <CodeBlock className={className}>{children}</CodeBlock>
                      );
                    },
                    pre({ children }) {
                      return <div>{children}</div>;
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            )}

            {/* ACTIONS */}
            {!isTyping && (
              <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  onClick={() =>
                    setFeedback(feedback === "good" ? null : "good")
                  }
                  className={`p-1.5 rounded-lg transition-colors ${feedback === "good" ? "text-green-600 bg-green-100 dark:bg-green-900/30" : "text-slate-400 hover:text-green-600 hover:bg-green-50"}`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFeedback(feedback === "bad" ? null : "bad")}
                  className={`p-1.5 rounded-lg transition-colors ${feedback === "bad" ? "text-red-600 bg-red-100 dark:bg-red-900/30" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCopyMessage}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <span className="w-px h-4 bg-slate-200 dark:bg-slate-600 mx-1" />
                <button
                  onClick={() => onAction?.("explain_5")}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Explain</span>
                </button>
                <button
                  onClick={() => onAction?.("quiz")}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Quiz</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* User Message */
        <div className="max-w-[85%] md:max-w-[75%] flex flex-col items-end gap-1">
          {isEditing ? (
            <div
              className="flex flex-col gap-2"
              style={{
                width: initialWidth === "auto" ? "100%" : `${initialWidth}px`,
              }}
            >
              <div className="bg-[#ecf2fe] rounded-2xl border-2 border-blue-400 box-border px-4 py-2.5">
                <textarea
                  className="w-full bg-transparent text-slate-800 text-sm md:text-[15px] leading-relaxed outline-none resize-none p-0 overflow-hidden block"
                  style={{
                    height: Math.max(20, initialHeight - 24) + "px",
                    minHeight: Math.max(20, initialHeight - 24) + "px",
                    fontFamily: "inherit",
                  }}
                  value={editedText}
                  onChange={(e) => {
                    setEditedText(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  ref={(el) => {
                    if (el) {
                      setTimeout(() => {
                        el.style.height = "auto";
                        el.style.height =
                          Math.max(
                            Math.max(20, initialHeight - 24),
                            el.scrollHeight,
                          ) + "px";
                      }, 0);
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditedText(msg.text);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={messageRef}
                className="bg-[#ecf2fe] text-slate-800 rounded-2xl px-4 py-2.5"
              >
                <span className="whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed">
                  {msg.text}
                </span>
              </div>
              <div className="flex items-center gap-0.5 px-1">
                <button
                  onClick={() => {
                    if (messageRef.current) {
                      setInitialHeight(messageRef.current.offsetHeight);
                      setInitialWidth(messageRef.current.offsetWidth);
                    }
                    setIsEditing(true);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={handleCopyMessage}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
