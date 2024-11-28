// controllers/apiController.js

const Data = require('../models/Data');

/**
 * Create new data (No authentication required).
 */
exports.createData = async (req, res) => {
    const { title, description, status, priority, owner } = req.body;

    // Basic validation
    if (!title || !owner) {
        return res.status(400).json({ error: 'Title and owner are required.' });
    }

    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority value.' });
    }

    try {
        const data = new Data({ title, description, status, priority, owner });
        await data.save();
        res.status(201).json({ message: 'Data created successfully.', data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create data.' });
    }
};

/**
 * Retrieve data by ID (No authentication required).
 */
exports.getDataById = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Data.findById(id).populate('owner', 'username');
        if (!data) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve data.' });
    }
};

/**
 * Update data by ID (No authentication required).
 */
exports.updateDataById = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (status) {
        if (!['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value.' });
        }
        updateFields.status = status;
    }
    if (priority) {
        if (!['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority value.' });
        }
        updateFields.priority = priority;
    }

    try {
        const data = await Data.findByIdAndUpdate(id, updateFields, { new: true });
        if (!data) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        res.json({ message: 'Data updated successfully.', data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update data.' });
    }
};

/**
 * Delete data by ID (No authentication required).
 */
exports.deleteDataById = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Data.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).json({ error: 'Data not found.' });
        }
        res.json({ message: 'Data deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete data.' });
    }
};
