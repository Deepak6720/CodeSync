import { Play, Moon, Sun, ChevronDown, Save, History } from "lucide-react";
import useEditorStore from "../../store/editorStore";
import useSnapshotStore from "../../store/snapshotStore";
import { LANGUAGES } from "../../utils/languages";

const EditorToolbar = ({ roomName, onRun, onLanguageChange, onSave }) => {
  const { language, theme, setLanguage, toggleTheme, isRunning } =
    useEditorStore();
  const { isSaving, isHistoryOpen, toggleHistory } = useSnapshotStore();

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (onLanguageChange) onLanguageChange(newLanguage);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
      {/* LEFT — Room name + Language */}
      <div className="flex items-center gap-4">
        <span className="text-white font-semibold text-sm truncate max-w-32">
          {roomName || "Editor"}
        </span>

        <div className="relative">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="appearance-none bg-gray-800 border border-gray-700 text-white text-sm px-3 py-1.5 pr-8 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* RIGHT — Save + History + Theme + Run */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300 px-3 py-1.5 rounded-lg transition-colors text-sm"
          title="Save snapshot (Ctrl+S)"
        >
          {isSaving ? (
            <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={14} className="text-purple-400" />
          )}
          <span className="hidden sm:block">
            {isSaving ? "Saving..." : "Save"}
          </span>
        </button>

        <button
          onClick={toggleHistory}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
            isHistoryOpen
              ? "bg-purple-600 text-white"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
          }`}
          title="Version history"
        >
          <History size={14} />
          <span className="hidden sm:block">History</span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors text-sm"
        >
          {theme === "vs-dark" ? (
            <Sun size={15} className="text-yellow-400" />
          ) : (
            <Moon size={15} className="text-blue-400" />
          )}
          <span className="hidden sm:block">
            {theme === "vs-dark" ? "Light" : "Dark"}
          </span>
        </button>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg transition-colors text-sm font-medium"
        >
          {isRunning ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play size={15} fill="white" />
              <span>Run</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
