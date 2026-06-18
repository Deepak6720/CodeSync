import { X, History, RotateCcw, Save, User, Clock } from "lucide-react";
import useSnapshotStore from "../../store/snapshotStore";
import { formatMessageTime } from "../../utils/timeFormat";

const VersionHistory = ({ onRestore }) => {
  const { snapshots, isLoading, isSaving, isHistoryOpen, toggleHistory } =
    useSnapshotStore();

  if (!isHistoryOpen) return null;

  return (
    // Panel slides in from right, next to chat
    <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0 animate-slide-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <History size={16} className="text-purple-400" />
          <span className="text-white font-medium text-sm">
            Version History
          </span>
          {snapshots.length > 0 && (
            <span className="text-gray-500 text-xs">({snapshots.length})</span>
          )}
        </div>
        <button
          onClick={toggleHistory}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : snapshots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 px-4">
            <History size={32} className="text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              No versions saved yet
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Click Save or press Ctrl+S to create a version
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {snapshots.map((snapshot, index) => (
              <div
                key={snapshot._id}
                className="p-4 hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">
                      v{snapshots.length - index}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        snapshot.saveType === "auto"
                          ? "bg-gray-700 text-gray-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {snapshot.saveType === "auto" ? "auto" : "manual"}
                    </span>
                  </div>

                  <button
                    onClick={() => onRestore(snapshot)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <RotateCcw size={11} />
                    <span>Restore</span>
                  </button>
                </div>
                <p className="text-gray-400 text-xs mb-1 font-mono">
                  {snapshot.fileName}
                </p>
                {snapshot.code && (
                  <div className="bg-gray-950 rounded px-2 py-1.5 mb-2">
                    <p className="text-gray-400 text-xs font-mono truncate">
                      {snapshot.code.split("\n")[0] || "(empty file)"}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <User size={10} />
                    <span className="truncate max-w-24">
                      {snapshot.savedByName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <Clock size={10} />
                    <span>{formatMessageTime(snapshot.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isSaving && (
        <div className="px-4 py-3 border-t border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Saving...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionHistory;
