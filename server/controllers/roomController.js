const Room = require('../models/Room');
const RoomMember = require('../models/RoomMember');
const { v4: uuidv4 } = require('uuid');
const createRoom = async (req, res) => {
  try {
    const { name, language } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Room name is required' });
    }

    const inviteCode = uuidv4().split('-')[0].toUpperCase();
    const room = await Room.create({
      name,
      language: language || 'javascript',
      inviteCode,
      ownerId: req.userId,
    });

    await RoomMember.create({
      roomId: room._id,
      userId: req.userId,
      role: 'owner',
    });

    res.status(201).json({
      message: 'Room created successfully',
      room,
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error creating room' });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const room = await Room.findOne({
      inviteCode: inviteCode.toUpperCase()
    });

    if (!room) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    const existingMember = await RoomMember.findOne({
      roomId: room._id,
      userId: req.userId,
    });

    if (existingMember) {
      return res.status(200).json({
        message: 'Already a member of this room',
        room,
      });
    }

    await RoomMember.create({
      roomId: room._id,
      userId: req.userId,
      role: 'member',
    });

    res.status(200).json({
      message: 'Joined room successfully',
      room,
    });

  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error joining room' });
  }
};

const getRooms = async (req, res) => {
  try {

    const memberships = await RoomMember.find({ userId: req.userId });

    const roomIds = memberships.map((m) => m.roomId);

    const rooms = await Room.find({ _id: { $in: roomIds } })
      .sort({ createdAt: -1 });

    const roomsWithDetails = await Promise.all(
      rooms.map(async (room) => {
        const memberCount = await RoomMember.countDocuments({
          roomId: room._id
        });

        const membership = memberships.find(
          (m) => m.roomId.toString() === room._id.toString()
        );

        return {
          ...room.toObject(), 
          memberCount,
          userRole: membership?.role || 'member',
        };
      })
    );

    res.status(200).json({ rooms: roomsWithDetails });

  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error fetching rooms' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the owner can delete this room' });
    }

    await Room.findByIdAndDelete(id);

    await RoomMember.deleteMany({ roomId: id });

    res.status(200).json({ message: 'Room deleted successfully' });

  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error deleting room' });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, language } = req.body;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the owner can update this room' });
    }

    if (name) room.name = name;
    if (language) room.language = language;

    await room.save();

    res.status(200).json({ message: 'Room updated successfully', room });

  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error updating room' });
  }
};

module.exports = { createRoom, joinRoom, getRooms, deleteRoom, updateRoom };