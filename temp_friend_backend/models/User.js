const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['citizen', 'student', 'faculty', 'industry', 'admin'],
      default: 'citizen',
    },
    organization: {
      type: String,
      default: '', // University name, Company, or Panchayat
    },
    department: {
      type: String,
      default: '', // e.g. CSE, Civil, Environmental, Mechanical
    },
    district: {
      type: String,
      default: 'Ranchi', // Jharkhand districts: Ranchi, Dhanbad, Bokaro, etc.
    },
    phone: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
