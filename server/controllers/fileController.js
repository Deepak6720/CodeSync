const File = require('../models/File');
const Room = require('../models/Room');

const getFiles = async (req, res) => {
  try {
    const { roomId } = req.params;

    const files = await File.find({ roomId })
      .sort({ createdAt: 1 }) 

    res.status(200).json({ files });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Server error fetching files' });
  }
};

const createFile = async (req, res) => {
  try {
    const { roomId, name, language } = req.body;

    if (!roomId || !name) {
      return res.status(400).json({
        message: 'Room ID and file name are required'
      });
    }

    const existingFile = await File.findOne({ roomId, name });
    if (existingFile) {
      return res.status(400).json({
        message: 'A file with this name already exists'
      });
    }

    const detectedLanguage = language || detectLanguageFromName(name);

    const file = await File.create({
      roomId,
      name,
      language: detectedLanguage,
      content: '',
      createdBy: req.userId,
    });

    res.status(201).json({
      message: 'File created successfully',
      file,
    });

  } catch (error) {
    console.error('Create file error:', error);
    res.status(500).json({ message: 'Server error creating file' });
  }
};

const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content, language } = req.body;

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (name && name !== file.name) {
      const existingFile = await File.findOne({
        roomId: file.roomId,
        name,
        _id: { $ne: id }, 
      });
      if (existingFile) {
        return res.status(400).json({
          message: 'A file with this name already exists'
        });
      }
      file.name = name;
      file.language = detectLanguageFromName(name);
    }

    if (content !== undefined) file.content = content;
    if (language) file.language = language;

    await file.save();

    res.status(200).json({
      message: 'File updated successfully',
      file,
    });

  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({ message: 'Server error updating file' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileCount = await File.countDocuments({ roomId: file.roomId });
    if (fileCount <= 1) {
      return res.status(400).json({
        message: 'Cannot delete the last file in a room'
      });
    }

    await File.findByIdAndDelete(id);

    res.status(200).json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error deleting file' });
  }
};

const detectLanguageFromName = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    cpp: 'cpp',
    cc: 'cpp',
    c: 'cpp',
    java: 'java',
    go: 'go',
    rs: 'rust',
    html: 'html',
    css: 'css',
    sql: 'sql',
    md: 'markdown',
    json: 'json',
  }
  return map[ext] || 'javascript'
}

module.exports = { getFiles, createFile, updateFile, deleteFile };