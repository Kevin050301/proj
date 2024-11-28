// middlewares/auth.js

const User = require('../models/User');

/**
 * Middleware to check if user is authenticated.
 */
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/login');
}

/**
 * Middleware to check if user has admin role.
 */
async function isAdmin(req, res, next) {
    if (!req.session.userId) {
        req.flash('error_msg', 'Please log in to view that resource');
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId);
        if (user && user.role === 'admin') {
            return next();
        }
        req.flash('error_msg', 'You are not authorized to view that resource');
        res.redirect('/crud');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred');
        res.redirect('/crud');
    }
}

module.exports = { isAuthenticated, isAdmin };
