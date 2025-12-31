import express from 'express';
import { Task } from '../models/Task.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get Tasks (with pagination)
router.get('/', auth, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const tasks = await Task.find({ user: req.userId })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Task.countDocuments({ user: req.userId });

        res.status(200).json({
            tasks,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Single Task
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Task
router.post('/', auth, async (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    try {
        const newTask = await Task.create({
            title,
            description,
            dueDate,
            priority,
            user: req.userId
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Task
router.put('/:id', auth, async (req, res) => {
    const { title, description, dueDate, priority, status } = req.body;
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { title, description, dueDate, priority, status },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
