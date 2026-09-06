const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { redisClient } = require('../config/redis');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// ── Signup Controller ────────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password, role, organization, department, district, phone, skills } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await User.create({
      name: name ? name.trim() : '',
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'citizen',
      organization: organization || '',
      department: department || '',
      district: district || 'Ranchi',
      phone: phone || '',
      skills: Array.isArray(skills) ? skills : [],
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: newUser.organization,
        district: newUser.district,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// ── Signin Controller ────────────────────────────────────────────────────────
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: 'Signed in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        district: user.district,
      },
      token,
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// ── Logout Controller ────────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      // Blacklist token in Redis if available
      if (redisClient && redisClient.isOpen) {
        try {
          const decoded = jwt.decode(token);
          const expiry = decoded && decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 86400;
          if (expiry > 0) {
            await redisClient.set(`blacklist_${token}`, 'true', { EX: expiry });
          }
        } catch (redisErr) {
          console.warn('Redis token blacklist warning:', redisErr.message);
        }
      }
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = {
  signup,
  signin,
  logout,
};
