import Editor from "@monaco-editor/react";
import useEditorStore from "../../store/editorStore";

const CodeEditor = ({ onMount }) => {
  const { language, theme } = useEditorStore();

  const handleEditorDidMount = (editor, monaco) => {
    if (onMount) onMount(editor, monaco);
    editor.focus();
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log("Ctrl+S pressed — save coming in Phase 10");
    });
  };

  return (
    <Editor
      height="100%"
      width="100%"
      language={language}
      theme={theme}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontLigatures: true,
        lineNumbers: "on",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        bracketPairColorization: { enabled: true },
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        formatOnPaste: true,
        padding: { top: 16, bottom: 16 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        renderLineHighlight: "all",
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-gray-900">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Loading Editor...</p>
          </div>
        </div>
      }
    />
  );
};

export default CodeEditor;
