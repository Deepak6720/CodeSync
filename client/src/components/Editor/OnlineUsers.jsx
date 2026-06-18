import { useState } from "react";
import { Users } from "lucide-react";

const OnlineUsers = ({ users, isConnected }) => {
  const [showList, setShowList] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowList(!showList)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-400" : "bg-red-400"
          }`}
        />
        <div className="flex -space-x-2">
          {users.slice(0, 4).map((user, index) => (
            <div
              key={user.id || index}
              className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: user.color || "#4ECDC4" }}
              title={user.name}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
          ))}
          {users.length > 4 && (
            <div className="w-6 h-6 rounded-full border-2 border-gray-800 bg-gray-600 flex items-center justify-center text-xs text-white">
              +{users.length - 4}
            </div>
          )}
        </div>

        <span className="text-gray-400 text-xs">{users.length}</span>
      </button>

      {showList && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowList(false)}
          />

          <div className="absolute right-0 top-10 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 w-52 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
              <Users size={14} className="text-gray-400" />
              <span className="text-gray-300 text-sm font-medium">
                Online ({users.length})
              </span>
            </div>

            <div className="py-2 max-h-60 overflow-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 text-xs px-4 py-2">
                  No one else here yet
                </p>
              ) : (
                users.map((user, index) => (
                  <div
                    key={user.id || index}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: user.color || "#4ECDC4" }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{user.name}</p>
                    </div>

                    <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OnlineUsers;
