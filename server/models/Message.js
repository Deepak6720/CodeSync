const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    senderName: {
      type: String,
      required: true,
    },

    senderAvatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
messageSchema.index({ roomId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
