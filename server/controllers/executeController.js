const axios = require("axios");
const JDOODLE_LANGUAGES = {
  javascript: { language: "nodejs", versionIndex: "4" },
  python: { language: "python3", versionIndex: "4" },
  cpp: { language: "cpp17", versionIndex: "1" },
  java: { language: "java", versionIndex: "4" },
  typescript: { language: "typescript", versionIndex: "1" },
  go: { language: "go", versionIndex: "4" },
  rust: { language: "rust", versionIndex: "4" },
  sql: { language: "sql", versionIndex: "4" },
  html: { language: "nodejs", versionIndex: "4" },
  css: { language: "nodejs", versionIndex: "4" },
};

const executeCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        message: "Code and language are required",
      });
    }

    const langConfig =
      JDOODLE_LANGUAGES[language] || JDOODLE_LANGUAGES["javascript"];

    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      {
        script: code,
        language: langConfig.language,
        versionIndex: langConfig.versionIndex,
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        stdin: "",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const { output, statusCode, memory, cpuTime } = response.data;
    const isSuccess = statusCode === 200;

    // Check if output contains common error patterns
    const hasError =
      output?.toLowerCase().includes("error") ||
      output?.toLowerCase().includes("exception") ||
      output?.toLowerCase().includes("traceback");

    res.status(200).json({
      stdout: isSuccess && !hasError ? output || "" : "",
      stderr: !isSuccess || hasError ? output || "" : "",
      compile_output: "",
      time: cpuTime ? String(cpuTime) : "0.000",
      memory: memory || 0,
      status: {
        id: isSuccess ? 3 : 11,
        description: isSuccess ? "Accepted" : "Runtime Error",
      },
    });
  } catch (error) {
    console.error("Execute error:", error.response?.data || error.message);

    // JDoodle credit limit exceeded
    if (error.response?.status === 400) {
      const msg = error.response?.data?.error || "";
      if (msg.includes("credit")) {
        return res.status(429).json({
          message: "Daily limit (22 Credits) reached. Try again tomorrow.",
        });
      }
    }

    if (error.code === "ECONNABORTED") {
      return res.status(408).json({ message: "Code execution timed out" });
    }

    res.status(500).json({
      message: "Server error during code execution",
    });
  }
};

module.exports = { executeCode };
