const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

/**
 * Protect routes: verify JWT and check Redis blacklist
 */
const protect = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, token missing' });
    }

    // Check Redis blacklist
    if (redisClient && redisClient.isOpen) {
      try {
        const isBlacklisted = await redisClient.get(`blacklist_${token}`);
        if (isBlacklisted) {
          return res.status(401).json({ error: 'Token is invalid or logged out' });
        }
      } catch (redisErr) {
        console.warn('Redis check warning:', redisErr.message);
      }
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized, token invalid or expired' });
  }
};

/**
 * Role-Based Access Control (RBAC)
 * @param  {...string} roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Role '${req.user ? req.user.role : 'anonymous'}' is not authorized.`,
      });
    }
    next();
  };
};

/**
 * Optional Auth (populates req.user if token is valid, but allows anonymous if not)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) req.user = user;
    }
  } catch (err) {
    // Ignore invalid token in optional mode
  }
  next();
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
};
