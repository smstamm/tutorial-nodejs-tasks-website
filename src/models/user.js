const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./task');

const userSchema = new mongoose.Schema({
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
    unique: true,
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
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


// Delete user's tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
});

userSchema.statics.findByCredentials = async(email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to log in.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
    
  if (!isMatch) {
    throw new Error('Unable to log in.');
  }

  return user;
}

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.tokens;
  delete userObject.password;
  return userObject;
}

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'token');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;