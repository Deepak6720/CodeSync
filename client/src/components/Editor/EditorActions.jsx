import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { exportCodeAsFile } from "../../utils/exportCode";

const EditorActions = ({ getCode, fileName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = getCode();
    if (!code?.trim()) {
      toast.error("Nothing to copy!");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard! 📋");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Try selecting manually.");
    }
  };

  const handleExport = () => {
    const code = getCode();
    if (!code?.trim()) {
      toast.error("Nothing to export!");
      return;
    }

    exportCodeAsFile(code, fileName);
    toast.success(`Downloaded ${fileName}! 💾`);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg transition-all"
        title="Copy code to clipboard"
      >
        {copied ? (
          <Check size={13} className="text-green-400" />
        ) : (
          <Copy size={13} />
        )}
        <span>{copied ? "Copied!" : "Copy"}</span>
      </button>
      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg transition-all"
        title={`Download as ${fileName}`}
      >
        <Download size={13} />
        <span>Export</span>
      </button>
    </div>
  );
};

export default EditorActions;
