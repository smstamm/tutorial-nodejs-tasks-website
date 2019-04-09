const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be positive number.');
      }
    },
    lowercase: true,
    trim: true,
    default: 0
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is not valid.');
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (validator.contains(value, 'password')) {
        throw new Error('Password cannot contain "password."')
      }
      if (value.length < 7) {
        throw new Error('Password must be at least 7 characters long');
      }
    },
    trim: true,
  }
});

module.exports = User;