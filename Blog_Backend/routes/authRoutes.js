const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

router.post('/login', async (req, res) => {
  const allUsers = await User.find();
  console.log('All users in DB:', allUsers);
  
  const { username, password } = req.body;
  console.log('Login attempt with:', username, password); 

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'testsecret', 
      { expiresIn: '1h' }
    );

    return res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error); 
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
