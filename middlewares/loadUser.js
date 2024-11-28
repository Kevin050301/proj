// middlewares/loadUser.js

const User = require('../models/User');

/**
 * Middleware to load current user into res.locals.
 */
async function loadUser(req, res, next) {
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('-password');
            res.locals.currentUser = user;
        } catch (err) {
            console.error(err);
            res.locals.currentUser = null;
        }
    } else {
        res.locals.currentUser = null;
    }
    next();
}

module.exports = loadUser;
