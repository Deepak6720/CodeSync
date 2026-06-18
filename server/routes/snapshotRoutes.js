const express = require("express");
const router = express.Router();
const {
  saveSnapshot,
  getSnapshots,
  restoreSnapshot,
} = require("../controllers/snapshotController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", saveSnapshot);
router.get("/:roomId", getSnapshots);
router.post("/:id/restore", restoreSnapshot);

module.exports = router;
