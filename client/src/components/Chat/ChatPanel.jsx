import { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import useChatStore from "../../store/chatStore";
import useAuthStore from "../../store/authStore";
import { formatMessageTime } from "../../utils/timeFormat";

const ChatPanel = ({ onSendMessage }) => {
  const { messages, isLoading, isChatOpen, toggleChat } = useChatStore();
  const { user } = useAuthStore();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isChatOpen) return null;

  const currentUserId = user?._id || user?.id;

  return (
    <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0 animate-slide-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-400" />
          <span className="text-white font-medium text-sm">Chat</span>
          {messages.length > 0 && (
            <span className="text-gray-500 text-xs">({messages.length})</span>
          )}
        </div>
        <button
          onClick={toggleChat}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="h-8 bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <MessageSquare size={32} className="text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-600 text-xs mt-1">
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage =
              message.senderId?.toString() === currentUserId?.toString();

            const prevMessage = messages[index - 1];
            const isSameSender =
              prevMessage &&
              prevMessage.senderId?.toString() === message.senderId?.toString();

            return (
              <div
                key={message._id}
                className={`flex gap-2 ${
                  isOwnMessage ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar — only show for first message in a group */}
                {!isOwnMessage && (
                  <div className="shrink-0">
                    {!isSameSender ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{
                          backgroundColor: stringToColor(message.senderName),
                        }}
                      >
                        {message.senderName?.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-6"></div>
                    )}
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-[200px] ${
                    isOwnMessage ? "items-end" : "items-start"
                  }`}
                >
                  {!isOwnMessage && !isSameSender && (
                    <span className="text-xs text-gray-400 mb-1 ml-1">
                      {message.senderName}
                    </span>
                  )}

                  <div
                    className={`px-3 py-2 rounded-2xl text-sm break-words ${
                      isOwnMessage
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-gray-800 text-gray-200 rounded-tl-sm"
                    } ${message.isOptimistic ? "opacity-70" : "opacity-100"}`}
                  >
                    {message.content}
                  </div>

                  <span className="text-xs text-gray-600 mt-1 mx-1">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-800">
        <div className="flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            style={{
              minHeight: "36px",
              maxHeight: "80px",
            }}
          />

          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex items-center justify-center w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0"
          >
            <Send size={15} />
          </button>
        </div>

        <p className="text-gray-600 text-xs mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

const stringToColor = (str = "") => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#F08080",
    "#98D8C8",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default ChatPanel;
