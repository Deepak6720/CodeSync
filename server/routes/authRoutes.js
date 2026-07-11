const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  validate,
  registerSchema,
  loginSchema,
} = require("../middleware/validateInput");
router.post("/register", authLimiter, validate(registerSchema), register);

router.post("/login", authLimiter, validate(loginSchema), login);

router.get("/me", authMiddleware, getMe);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_failed`,
  }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  }
);

module.exports = router;
