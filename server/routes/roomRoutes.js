const express = require("express");
const router = express.Router();
const {
  createRoom,
  joinRoom,
  getRooms,
  deleteRoom,
  updateRoom,
} = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validate,
  createRoomSchema,
  joinRoomSchema,
} = require("../middleware/validateInput");

router.use(authMiddleware);
router.post("/create", validate(createRoomSchema), createRoom);
router.post("/join", validate(joinRoomSchema), joinRoom);
router.get("/", getRooms);
router.delete("/:id", deleteRoom);
router.put("/:id", updateRoom);

module.exports = router;
