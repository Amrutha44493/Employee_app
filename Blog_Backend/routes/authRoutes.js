const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });

  try {
    const user = await User.findOne({ username });
    console.log('Found user:', user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const isMatch = await user.comparePassword(password);
    console.log(' Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('JWT generated:', token);

    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;