// controllers/authController.js

const User = require('../models/User'); // 假设您有一个 User 模型
const bcrypt = require('bcryptjs');

// 显示注册页面
exports.getRegister = (req, res) => {
    res.render('register', { title: 'Register', errors: [], username: '', password: '', password2: '' });
};

// 处理注册逻辑
exports.postRegister = async (req, res) => {
    const { username, password, password2 } = req.body;
    let errors = [];

    // 检查必填字段
    if (!username || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    // 检查密码是否匹配
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // 检查密码长度
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            title: 'Register',
            errors,
            username,
            password,
            password2
        });
    } else {
        // Validation passed
        try {
            let user = await User.findOne({ username });
            if (user) {
                errors.push({ msg: 'Username already exists' });
                res.render('register', {
                    title: 'Register',
                    errors,
                    username,
                    password,
                    password2
                });
            } else {
                const newUser = new User({ username, password });

                // // Hash password
                // const salt = await bcrypt.genSalt(10);
                // newUser.password = await bcrypt.hash(password, salt);

                await newUser.save();

                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/login');
            }
        } catch (err) {
            console.error(err);
            res.status(500).render('500', { title: '500 Server Error' });
        }
    }
};

// 显示登录页面
exports.getLogin = (req, res) => {
    res.render('login', { title: 'Login', errors: [], username: '', password: '' });
};

// 处理登录逻辑
exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    let errors = [];

    if (!username || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.render('login', {
            title: 'Login',
            errors,
            username,
            password
        });
    } else {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                errors.push({ msg: 'That username is not registered' });
                return res.render('login', {
                    title: 'Login',
                    errors,
                    username,
                    password
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.userId = user._id;
                res.redirect('/crud');
            } else {
                errors.push({ msg: 'Password incorrect' });
                res.render('login', {
                    title: 'Login',
                    errors,
                    username,
                    password
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).render('500', { title: '500 Server Error' });
        }
    }
};

// 处理登出逻辑
exports.logout = (req, res) => {
    // 先设置闪存消息
    req.flash('success_msg', 'You are logged out');

    // 然后销毁会话
    req.session = null;

    // 重定向到登录页面
    res.redirect('/login');
};