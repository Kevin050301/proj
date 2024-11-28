// controllers/crudController.js

const Data = require('../models/Data');
const { validationResult } = require('express-validator');

/**
 * Render CRUD home page with list of user's data.
 */
exports.getCrudHome = async (req, res) => {
    try {
        const dataList = await Data.find({ owner: req.session.userId }).sort({ createdAt: -1 });
        res.render('crud', { title: 'Your Data', dataList });
    } catch (err) {
        console.error(err);
        res.render('crud', { title: 'Your Data', errors: [{ msg: 'Failed to retrieve data.' }], dataList: [] });
    }
};

/**
 * Render create data page.
 */
exports.getCreateData = (req, res) => {
    res.render('create', { title: 'Create New Data' });
};

/**
 * Handle create data.
 */
exports.postCreateData = async (req, res) => {
    const { title, description, status, priority } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('create', { 
            title: 'Create New Data', 
            errors: errors.array(),
            titleValue: title,
            descriptionValue: description,
            statusValue: status,
            priorityValue: priority
        });
    }

    try {
        const data = new Data({
            title,
            description,
            status,
            priority,
            owner: req.session.userId,
        });
        await data.save();
        req.flash('success_msg', 'Data created successfully');
        res.redirect('/crud');
    } catch (err) {
        console.error(err);
        res.render('create', { 
            title: 'Create New Data', 
            errors: [{ msg: 'Failed to create data.' }],
            titleValue: title,
            descriptionValue: description,
            statusValue: status,
            priorityValue: priority
        });
    }
};

/**
 * Render update data page.
 */
exports.getUpdateData = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Data.findOne({ _id: id, owner: req.session.userId });
        if (!data) {
            req.flash('error_msg', 'Data not found');
            return res.redirect('/crud');
        }
        res.render('update', { title: 'Update Data', data });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred');
        res.redirect('/crud');
    }
};

/**
 * Handle update data.
 */
exports.putUpdateData = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('update', { 
            title: 'Update Data', 
            errors: errors.array(),
            data: { _id: id, title, description, status, priority }
        });
    }

    try {
        const data = await Data.findOneAndUpdate(
            { _id: id, owner: req.session.userId },
            { title, description, status, priority, updatedAt: Date.now() },
            { new: true }
        );
        if (!data) {
            req.flash('error_msg', 'Data not found');
            return res.redirect('/crud');
        }
        req.flash('success_msg', 'Data updated successfully');
        res.redirect('/crud');
    } catch (err) {
        console.error(err);
        res.render('update', { 
            title: 'Update Data', 
            errors: [{ msg: 'Failed to update data.' }],
            data: { _id: id, title, description, status, priority }
        });
    }
};

/**
 * Handle delete data.
 */
exports.deleteData = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Data.findOneAndDelete({ _id: id, owner: req.session.userId });
        if (!data) {
            req.flash('error_msg', 'Data not found');
            return res.redirect('/crud');
        }
        req.flash('success_msg', 'Data deleted successfully');
        res.redirect('/crud');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete data');
        res.redirect('/crud');
    }
};

/**
 * Render search data page.
 */
/**
 * Render search data page.
 */
exports.getSearchData = (req, res) => {
    res.render('search', { 
        title: 'Search Data', 
        results: [], // 修改为空数组
        errors: [],
        title: '',
        description: '',
        status: '',
        priority: ''
    });
};
/**
 * Handle search data.
 */
/**
 * Handle search data.
 */
exports.postSearchData = async (req, res) => {
    const { title, description, status, priority } = req.body;
    const query = { owner: req.session.userId };

    if (title) query.title = { $regex: title, $options: 'i' };
    if (description) query.description = { $regex: description, $options: 'i' };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    try {
        const results = await Data.find(query).sort({ createdAt: -1 });
        res.render('search', { 
            title: 'Search Data', 
            results,
            errors: [],
            title,
            description,
            status,
            priority
        });
    } catch (err) {
        console.error(err);
        res.render('search', { 
            title: 'Search Data', 
            errors: [{ msg: 'Search failed.' }],
            results: [], // 修改为空数组
            title,
            description,
            status,
            priority
        });
    }
};
