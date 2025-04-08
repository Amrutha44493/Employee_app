const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  designation: { type: String },
  department: { type: String },
});

module.exports = mongoose.model('Employee', employeeSchema);