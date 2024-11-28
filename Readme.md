# 381 Project Group X

## Introduction

381 Project Group X is a full-stack web application built with Node.js, Express, EJS, and MongoDB. It provides user authentication, CRUD (Create, Read, Update, Delete) operations on data objects, and a RESTful API for managing data. The application emphasizes security, user experience, and maintainability.

## Features

- **User Authentication:**
  - Register new users with secure password hashing.
  - Login and logout functionality with session management.
  
- **CRUD Operations:**
  - Create, read, update, and delete data entries.
  - Each data entry includes title, description, status, priority, creation date, and update date.
  
- **Search Functionality:**
  - Search data entries based on multiple criteria such as title, description, status, and priority.
  
- **RESTful API:**
  - Endpoints to manage data entries programmatically.
  
- **Security Enhancements:**
  - Input validation using `express-validator`.
  - Rate limiting to prevent brute-force attacks.
  - Secure session management with `cookie-session`.
  - HTTP headers protection using `helmet`.
  
- **Logging:**
  - HTTP request logging with `morgan`.
  - Error logging with `winston`.
  
- **User Roles:**
  - Basic role management with `user` and `admin` roles.

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose ODM
  - EJS Templating Engine
  - Express EJS Layouts
  - bcryptjs for password hashing
  - express-session and connect-flash for session management and flash messages
  - Helmet for security
  - express-rate-limit for rate limiting
  - morgan and winston for logging

- **Frontend:**
  - HTML5
  - CSS3
  - Bootstrap 5
