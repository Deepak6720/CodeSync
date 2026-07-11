const { z } = require('zod');
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),

  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password too long'),
});

const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address'),

  password: z
    .string()
    .min(1, 'Password is required'),
});

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, 'Room name is required')
    .max(50, 'Room name must be less than 50 characters')
    .trim(),

  language: z
    .string()
    .optional()
    .default('javascript'),
});

const joinRoomSchema = z.object({
  inviteCode: z
    .string()
    .min(1, 'Invite code is required')
    .max(20, 'Invalid invite code'),
});

const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message too long (max 500 characters)')
    .trim(),
});

const createFileSchema = z.object({
  roomId: z
    .string()
    .min(1, 'Room ID is required'),

  name: z
    .string()
    .min(1, 'File name is required')
    .max(100, 'File name too long')
    .trim()
    // Validate file name has no path separators or dangerous characters
    .refine(
      (name) => !name.includes('/') && !name.includes('\\'),
      'File name cannot contain path separators'
    ),
});

const executeSchema = z.object({
  code: z
    .string()
    .min(1, 'Code cannot be empty')
    .max(50000, 'Code too long (max 50,000 characters)'),

  language: z
    .string()
    .min(1, 'Language is required'),
});

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const firstError = error.issues?.[0];
    const message = firstError
      ? `${firstError.path.join('.')}: ${firstError.message}`
      : 'Invalid input';

    return res.status(400).json({ message });
  }
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createRoomSchema,
  joinRoomSchema,
  messageSchema,
  createFileSchema,
  executeSchema,
};