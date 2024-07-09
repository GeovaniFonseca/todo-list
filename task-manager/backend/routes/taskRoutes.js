const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const auth = require('../middleware/auth');

router.get('/tasks', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.getAllTasks(userId);
    res.json(tasks);
  } catch (err) {
    console.error('Error getting tasks:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const task = await Task.getTaskById(req.params.id, userId);
    res.json(task);
  } catch (err) {
    console.error('Error getting task by ID:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/tasks', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const newTask = { ...req.body, user_id: userId };
    console.log('Received new task:', newTask);
    const id = await Task.createTask(newTask);
    console.log('Task created with ID:', id);
    res.json({ id: Number(id), ...newTask });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/tasks/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedTask = { ...req.body, user_id: userId };
    await Task.updateTask(req.params.id, updatedTask);
    res.json({ id: req.params.id, ...updatedTask });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/tasks/:id/complete', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { completed } = req.body;
    await Task.completeTask(req.params.id, userId, completed);
    res.json({ id: req.params.id, completed });
  } catch (err) {
    console.error('Error completing task:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    await Task.deleteTask(req.params.id, userId);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
