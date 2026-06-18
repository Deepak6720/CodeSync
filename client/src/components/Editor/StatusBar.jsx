import { useEffect, useState } from "react";

const StatusBar = ({ getCode, language, fileName }) => {
  const [stats, setStats] = useState({
    lines: 0,
    words: 0,
    chars: 0,
  });

  // Recalculate stats whenever code changes, update every second
  useEffect(() => {
    const interval = setInterval(() => {
      const code = getCode?.() || "";

      const lines = code === "" ? 0 : code.split("\n").length;
      const words =
        code === "" ? 0 : code.trim().split(/\s+/).filter(Boolean).length;
      const chars = code.length;

      setStats({ lines, words, chars });
    }, 1000);

    return () => clearInterval(interval);
  }, [getCode]);

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-gray-900 border-t border-gray-800 text-xs text-gray-500 shrink-0">
      <div className="flex items-center gap-4">
        <span className="capitalize">{language}</span>
        <span>{fileName}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Ln {stats.lines}</span>
        <span>{stats.words} words</span>
        <span>{stats.chars} chars</span>
        <span className="text-gray-600">UTF-8</span>
      </div>
    </div>
  );
};

export default StatusBar;
