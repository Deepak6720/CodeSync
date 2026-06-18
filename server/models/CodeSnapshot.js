const mongoose = require("mongoose");

const codeSnapshotSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },

    code: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "main.js",
    },

    savedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    savedByName: {
      type: String,
      required: true,
    },

    // 'manual' = user clicked Save / Ctrl+S
    // 'auto'   = auto-save fired every 3 minutes
    saveType: {
      type: String,
      enum: ["manual", "auto"],
      default: "manual",
    },
  },
  {
    timestamps: true,
  }
);

codeSnapshotSchema.index({ roomId: 1, fileId: 1, createdAt: -1 });

const CodeSnapshot = mongoose.model("CodeSnapshot", codeSnapshotSchema);
module.exports = CodeSnapshot;
