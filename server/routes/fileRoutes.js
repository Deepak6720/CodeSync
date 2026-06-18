const express = require("express");
const router = express.Router();
const {
  getFiles,
  createFile,
  updateFile,
  deleteFile,
} = require("../controllers/fileController");
const authMiddleware = require("../middleware/authMiddleware");
const { validate, createFileSchema } = require("../middleware/validateInput");

router.use(authMiddleware);

router.get("/:roomId", getFiles);
router.post("/", validate(createFileSchema), createFile);
router.put("/:id", updateFile);
router.delete("/:id", deleteFile);

module.exports = router;
