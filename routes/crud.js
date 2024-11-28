// routes/crud.js

const express = require('express');
const router = express.Router();
const crudController = require('../controllers/crudController');
const { isAuthenticated } = require('../middlewares/auth');
const { body } = require('express-validator');

// Apply authentication middleware to all CRUD routes
router.use(isAuthenticated);

// GET CRUD Home Page (List Data)
router.get('/', crudController.getCrudHome);

// GET Create Data Page
router.get('/create', crudController.getCreateData);

// POST Create Data
router.post('/create', [
    body('title', 'Title is required').notEmpty(),
    body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
], crudController.postCreateData);

// GET Update Data Page
router.get('/update/:id', crudController.getUpdateData);

// PUT Update Data
router.put('/update/:id', [
    body('title', 'Title is required').notEmpty(),
    body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
], crudController.putUpdateData);

// DELETE Data
router.delete('/delete/:id', crudController.deleteData);

// GET Search Data Page
router.get('/search', crudController.getSearchData);

// POST Search Data
router.post('/search', crudController.postSearchData);

module.exports = router;
