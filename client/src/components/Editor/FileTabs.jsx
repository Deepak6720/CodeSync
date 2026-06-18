import { X, FileCode } from "lucide-react";
import useFileStore from "../../store/fileStore";

const FileTabs = ({ onFileSelect }) => {
  const { files, activeFileId, setActiveFile, deleteFile } = useFileStore();

  const getFileIconColor = (language) => {
    const colors = {
      javascript: "text-yellow-400",
      typescript: "text-blue-400",
      python: "text-green-400",
      cpp: "text-purple-400",
      java: "text-orange-400",
    };
    return colors[language] || "text-gray-400";
  };

  return (
    <div className="flex items-center bg-gray-950 border-b border-gray-800 overflow-x-auto shrink-0">
      {files.map((file) => (
        <div
          key={file._id}
          onClick={() => {
            setActiveFile(file._id);
            onFileSelect(file);
          }}
          className={`flex items-center gap-2 px-4 py-2 border-r border-gray-800 cursor-pointer group shrink-0 transition-colors ${
            activeFileId === file._id
              ? "bg-gray-900 border-t-2 border-t-blue-500"
              : "bg-gray-950 hover:bg-gray-900/50 border-t-2 border-t-transparent"
          }`}
        >
          <FileCode
            size={13}
            className={`shrink-0 ${getFileIconColor(file.language)}`}
          />
          <span
            className={`text-xs whitespace-nowrap ${
              activeFileId === file._id ? "text-white" : "text-gray-400"
            }`}
          >
            {file.name}
          </span>

          {files.length > 1 && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                await deleteFile(file._id);
              }}
              className="text-gray-600 hover:text-red-400 transition-colors ml-1 opacity-0 group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}

      <div className="flex-1 bg-gray-950 min-h-[36px]"></div>
    </div>
  );
};

export default FileTabs;
