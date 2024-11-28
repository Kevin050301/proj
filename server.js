// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const path = require('path');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const winston = require('winston');
const expressLayouts = require('express-ejs-layouts'); // 导入 express-ejs-layouts

// Initialize Express app
const app = express();

// Trust proxy to handle reverse proxy
app.set('trust proxy', true);

// Setup logging with morgan and winston
const logDirectory = path.join(__dirname, 'logs');

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create a write stream for morgan
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// Setup morgan middleware for HTTP request logging
app.use(morgan('combined', { stream: accessLogStream }));

// Setup winston logger for error logging
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDirectory, 'error.log') }),
    ],
});

// MongoDB Atlas connection string with database name 'proj'
const mongoURI = 'mongodb+srv://jum15368897766:Kmxmj2001@cluster0.ylmer.mongodb.net/proj?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas.');  // This shows connection status in terminal
        // After successful DB connection, start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);  // Show the server URL in terminal
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);  // If DB connection fails, show error
        logger.error('MongoDB connection error:', err);
        process.exit(1);  // Exit the application if DB connection fails
    });

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure method-override for PUT and DELETE methods
app.use(methodOverride('_method'));

// Configure helmet for enhanced security
app.use(helmet());

// Configure rate limiting to prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Configure cookie-session
app.use(cookieSession({
    name: 'session',
    keys: ['your_session_key_1', 'your_session_key_2'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
}));

// Configure flash messages
app.use(flash());

// Configure express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout'); // 设置默认布局文件为 views/layout.ejs

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Global variables middleware for flash messages and user session
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.userId;
    next();
});

// Import Routes
const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/crud');
const apiRoutes = require('./routes/api');

// Use Routes
app.use('/', authRoutes);
app.use('/crud', crudRoutes);
app.use('/api', apiRoutes);

// Home Route
app.get('/', (req, res) => {
    res.redirect('/login');
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).render('404', { title: '404 Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    logger.error('Server Error:', err);
    res.status(500).render('500', { title: '500 Server Error' });
});

