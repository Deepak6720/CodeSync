const Message = require('../models/Message');
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .limit(100)

    res.status(200).json({ messages });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

const saveMessage = async ({ roomId, senderId, content, senderName, senderAvatar }) => {
  try {
    const message = await Message.create({
      roomId,
      senderId,
      content,
      senderName,
      senderAvatar,
    });
    return message;
  } catch (error) {
    console.error('Save message error:', error);
    return null;
  }
};

module.exports = { getMessages, saveMessage };