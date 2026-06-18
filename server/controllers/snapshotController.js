const CodeSnapshot = require("../models/CodeSnapshot");
const File = require("../models/File");

const saveSnapshot = async (req, res) => {
  try {
    const { roomId, fileId, code, saveType } = req.body;

    if (!roomId || !fileId || code === undefined) {
      return res.status(400).json({
        message: "roomId, fileId, and code are required",
      });
    }

    const file = await File.findById(fileId);
    const fileName = file?.name || "main.js";

    const snapshot = await CodeSnapshot.create({
      roomId,
      fileId,
      code,
      fileName,
      savedBy: req.userId,
      savedByName: req.userName,
      saveType: saveType || "manual",
    });

    res.status(201).json({
      message: "Snapshot saved successfully",
      snapshot,
    });
  } catch (error) {
    console.error("Save snapshot error:", error);
    res.status(500).json({ message: "Server error saving snapshot" });
  }
};

const getSnapshots = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { fileId } = req.query;

    const query = { roomId };
    if (fileId) query.fileId = fileId;
    const snapshots = await CodeSnapshot.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ snapshots });
  } catch (error) {
    console.error("Get snapshots error:", error);
    res.status(500).json({ message: "Server error fetching snapshots" });
  }
};

const restoreSnapshot = async (req, res) => {
  try {
    const { id } = req.params;

    const snapshot = await CodeSnapshot.findById(id);

    if (!snapshot) {
      return res.status(404).json({ message: "Snapshot not found" });
    }
    await File.findByIdAndUpdate(snapshot.fileId, {
      content: snapshot.code,
    });

    res.status(200).json({
      message: "Snapshot restored successfully",
      code: snapshot.code,
      fileId: snapshot.fileId,
    });
  } catch (error) {
    console.error("Restore snapshot error:", error);
    res.status(500).json({ message: "Server error restoring snapshot" });
  }
};

module.exports = { saveSnapshot, getSnapshots, restoreSnapshot };
