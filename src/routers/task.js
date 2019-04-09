const express = require('express');
const router = express.Router();
const Task = require('../models/task');


router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    await Task.findById(_id, (err, task) => {
      if (err) {
        return res.status(404).send('Task not found.');
      }
      res.send(task);
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    const createdTask = await task.save();
    res.status(201).send(createdTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['complete', 'description'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send('Error: Invalid updates.');
  }
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }, (err, task) => {
      if (err) {
        return res.status(404).send(err);
      }
      res.send(task);
    })
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send('No task found.');
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;