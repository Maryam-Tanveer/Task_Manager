const Task = require('../models/Task');
const logger = require('../utils/logger');

exports.getTasks = async (req, res) => {
  try {
    const filter = { userId: req.user.id || req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });

    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (error) {
    logger.error(`❌ Error fetching tasks: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.user.id || req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    logger.error(`❌ Error fetching task: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to fetch task' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      userId: req.user.id || req.user._id,
    });

    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    logger.error(`❌ Error creating task: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id || req.user._id },
      update,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error) {
    logger.error(`❌ Error updating task: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id || req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    logger.error(`❌ Error deleting task: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
};
