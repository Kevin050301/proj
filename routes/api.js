// routes/api.js

const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// CREATE - POST /api/data
router.post('/data', apiController.createData);

// READ - GET /api/data/:id
router.get('/data/:id', apiController.getDataById);

// UPDATE - PUT /api/data/:id
router.put('/data/:id', apiController.updateDataById);

// DELETE - DELETE /api/data/:id
router.delete('/data/:id', apiController.deleteDataById);

module.exports = router;
