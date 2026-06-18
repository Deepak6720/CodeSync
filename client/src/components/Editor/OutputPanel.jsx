import { X, Terminal, CheckCircle, XCircle, Clock, Cpu } from "lucide-react";
import useEditorStore from "../../store/editorStore";

const OutputPanel = () => {
  const { output, showOutput, toggleOutput, isRunning } = useEditorStore();
  if (!showOutput) return null;
  const isSuccess = output?.status?.id === 3;
  const isError =
    output?.stderr ||
    output?.compile_output ||
    (output?.status?.id && output?.status?.id !== 3);

  return (
    <div className="h-52 bg-gray-950 border-t border-gray-800 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Terminal size={14} />
            <span className="font-medium">Output</span>
          </div>
          {output?.status && !isRunning && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isSuccess
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {output.status.description}
            </span>
          )}

          {output?.time && !isRunning && (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Clock size={11} />
              <span>{output.time}s</span>
            </div>
          )}

          {output?.memory && !isRunning && (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Cpu size={11} />
              <span>{(output.memory / 1024).toFixed(1)} MB</span>
            </div>
          )}
        </div>

        <button
          onClick={toggleOutput}
          className="text-gray-600 hover:text-gray-400 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {isRunning ? (
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Running your code...</span>
          </div>
        ) : output ? (
          <div className="space-y-3">
            {output.stdout && (
              <div>
                <div className="flex items-center gap-1.5 text-green-400 text-xs mb-1.5">
                  <CheckCircle size={12} />
                  <span>Output</span>
                </div>
                <pre className="text-green-300 whitespace-pre-wrap leading-relaxed">
                  {output.stdout}
                </pre>
              </div>
            )}

            {output.stderr && (
              <div>
                <div className="flex items-center gap-1.5 text-red-400 text-xs mb-1.5">
                  <XCircle size={12} />
                  <span>Runtime Error</span>
                </div>
                <pre className="text-red-300 whitespace-pre-wrap leading-relaxed">
                  {output.stderr}
                </pre>
              </div>
            )}

            {output.compile_output && (
              <div>
                <div className="flex items-center gap-1.5 text-yellow-400 text-xs mb-1.5">
                  <XCircle size={12} />
                  <span>Compile Error</span>
                </div>
                <pre className="text-yellow-300 whitespace-pre-wrap leading-relaxed">
                  {output.compile_output}
                </pre>
              </div>
            )}

            {!output.stdout && !output.stderr && !output.compile_output && (
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle size={14} className="text-green-500" />
                <span>Program ran successfully with no output</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-600">
            Click "Run" to execute your code...
          </span>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
