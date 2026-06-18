const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      default: "javascript",
    },
    content: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ roomId: 1, createdAt: 1 });

const File = mongoose.model("File", fileSchema);
module.exports = File;
