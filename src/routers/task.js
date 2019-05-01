const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');
const auth = require('../middleware/auth');


router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.complete) {
    match.complete = req.query.complete === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
  }

  try {
    // You have to know that userId is ownerId
    // const ownerId = req.user._id;
    // const tasks = await Task.find({ owner: ownerId });
    // res.send(tasks);

    // Using "populate" method
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
    res.send(req.user.tasks);

  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const taskId = req.params.id;
  const ownerId = req.user._id;

  try {
    const task = await Task.findOne({ _id: taskId, owner: ownerId });

    if (!task) {
      return res.status(404).send('Task not found.');
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    const createdTask = await task.save();
    res.status(201).send(createdTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['complete', 'description'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send('Error: Invalid updates.');
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }

    updates.forEach(update => task[update] = req.body[update]);

    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    console.log(req.user._id);
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send('No task found.');
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;