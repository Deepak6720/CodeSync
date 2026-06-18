const express = require("express");
const router = express.Router();
const { executeCode } = require("../controllers/executeController");
const authMiddleware = require("../middleware/authMiddleware");
const { executeLimiter } = require("../middleware/rateLimiter");
const { validate, executeSchema } = require("../middleware/validateInput");

router.post(
  "/",
  authMiddleware,
  executeLimiter,
  validate(executeSchema),
  executeCode
);

module.exports = router;
