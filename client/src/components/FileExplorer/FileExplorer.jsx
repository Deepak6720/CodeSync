import { useState, useRef } from "react";
import {
  FolderOpen,
  FileCode,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import useFileStore from "../../store/fileStore";
import toast from "react-hot-toast";

const FileExplorer = ({ roomName, onFileSelect }) => {
  const {
    files,
    activeFileId,
    isRenaming,
    setActiveFile,
    createFile,
    renameFile,
    deleteFile,
    startRenaming,
    stopRenaming,
  } = useFileStore();

  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [renameValue, setRenameValue] = useState("");

  const newFileInputRef = useRef(null);

  const handleCreateFile = async () => {
    if (!newFileName.trim()) {
      setShowNewFileInput(false);
      return;
    }
    let name = newFileName.trim();
    if (!name.includes(".")) name = `${name}.js`;

    const roomId = files[0]?.roomId;
    if (!roomId) return;

    const result = await createFile(roomId, name);

    if (result.success) {
      toast.success(`Created ${name}`);
      onFileSelect(result.file); 
    } else {
      toast.error(result.message);
    }

    setNewFileName("");
    setShowNewFileInput(false);
  };

  const handleRenameSubmit = async (fileId) => {
    if (!renameValue.trim()) {
      stopRenaming();
      return;
    }

    let name = renameValue.trim();
    if (!name.includes(".")) name = `${name}.js`;

    const result = await renameFile(fileId, name);

    if (result.success) {
      toast.success(`Renamed to ${name}`);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteFile = async (fileId, fileName, e) => {
    e.stopPropagation();

    if (!window.confirm(`Delete "${fileName}"? This cannot be undone.`)) return;

    const result = await deleteFile(fileId);
    if (result.success) {
      toast.success(`Deleted ${fileName}`);
    } else {
      toast.error(result.message);
    }
  };

  const getFileIconColor = (language) => {
    const colors = {
      javascript: "text-yellow-400",
      typescript: "text-blue-400",
      python: "text-green-400",
      cpp: "text-purple-400",
      java: "text-orange-400",
      go: "text-cyan-400",
      rust: "text-orange-500",
      html: "text-red-400",
      css: "text-blue-300",
      sql: "text-pink-400",
    };
    return colors[language] || "text-gray-400";
  };

  return (
    <div className="w-52 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <FolderOpen size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">
            {roomName || "Files"}
          </span>
        </div>

        <button
          onClick={() => {
            setShowNewFileInput(true);
            setTimeout(() => newFileInputRef.current?.focus(), 50);
          }}
          className="text-gray-500 hover:text-blue-400 transition-colors"
          title="New file"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-auto py-1">
        {files.map((file) => (
          <div
            key={file._id}
            onClick={() => {
              setActiveFile(file._id);
              onFileSelect(file);
            }}
            className={`group flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${
              activeFileId === file._id
                ? "bg-gray-800 border-l-2 border-blue-500"
                : "hover:bg-gray-800/50 border-l-2 border-transparent"
            }`}
          >
            <FileCode
              size={14}
              className={`shrink-0 ${getFileIconColor(file.language)}`}
            />
            {isRenaming === file._id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit(file._id);
                  if (e.key === "Escape") stopRenaming();
                }}
                onBlur={() => stopRenaming()}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-gray-700 text-white text-xs px-1 py-0.5 rounded outline-none border border-blue-500 min-w-0"
              />
            ) : (
              <span
                className={`flex-1 text-xs truncate ${
                  activeFileId === file._id
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-200"
                }`}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startRenaming(file._id);
                  setRenameValue(file.name);
                }}
              >
                {file.name}
              </span>
            )}
            {isRenaming !== file._id && (
              <div className="hidden group-hover:flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startRenaming(file._id);
                    setRenameValue(file.name);
                  }}
                  className="text-gray-600 hover:text-blue-400 transition-colors"
                  title="Rename"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  onClick={(e) => handleDeleteFile(file._id, file.name, e)}
                  className="text-gray-600 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )}
          </div>
        ))}

        {showNewFileInput && (
          <div className="flex items-center gap-2 px-3 py-1.5">
            <FileCode size={14} className="text-gray-500 shrink-0" />
            <input
              ref={newFileInputRef}
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFile();
                if (e.key === "Escape") {
                  setShowNewFileInput(false);
                  setNewFileName("");
                }
              }}
              onBlur={handleCreateFile}
              placeholder="filename.js"
              className="flex-1 bg-gray-700 text-white text-xs px-1 py-0.5 rounded outline-none border border-blue-500 min-w-0 placeholder-gray-500"
            />
          </div>
        )}
      </div>

      <div className="px-3 py-2 border-t border-gray-800">
        <p className="text-gray-600 text-xs">
          {files.length} file{files.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default FileExplorer;
