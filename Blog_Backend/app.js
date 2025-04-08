const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const { authenticateToken, authorizeRole } = require('./middleware/authMiddleware');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));
app.use('/api/auth', authRoutes);
app.use('/api/employees', authenticateToken, employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});