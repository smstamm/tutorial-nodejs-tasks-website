const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/test', (req, res) => {
  res.send('Hi');
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    await User.findById(_id, (err, user) => {
      if (err) {
        return res.status(404).send('User not found');
      }
      res.send(user);
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error)
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send('Error: Invalid updates.');
  }

  try {
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }, (err, user) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      res.send(user);
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send('No user found');
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;