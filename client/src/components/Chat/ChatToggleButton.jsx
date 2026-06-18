import { MessageSquare } from "lucide-react";
import useChatStore from "../../store/chatStore";

const ChatToggleButton = () => {
  const { isChatOpen, toggleChat, unreadCount } = useChatStore();

  return (
    <button
      onClick={toggleChat}
      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
        isChatOpen
          ? "bg-blue-600 text-white"
          : "bg-gray-800 hover:bg-gray-700 text-gray-300"
      }`}
    >
      <MessageSquare size={16} />
      <span className="hidden sm:block">Chat</span>

      {!isChatOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default ChatToggleButton;
