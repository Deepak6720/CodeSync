const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,                 
  message: {
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,  
  legacyHeaders: false,   
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: 'Too many login/register attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const executeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    message: 'Code execution limit reached. Max 20 runs per hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter, executeLimiter };