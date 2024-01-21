const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');

module.exports = function (app) {
  // ... (existing code)
  router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
  });
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (user && (await bcrypt.compare(password, user.password))) {
        req.session.userId = user._id;
        res.redirect('/dashboard');
      } else {
        res.send('Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
  });
  router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        res.send('Username already exists. Please choose a different one.');
      } else {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ username, password: hashedPassword });

        // Set the session for the new user
        req.session.userId = newUser._id;

        // Redirect to the dashboard after successful signup
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
      res.redirect('/login');
    } else {
      res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
    }
  });

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/login');
      }
    });
  });

  // Add more routes as needed

  // Example route with express.json()
  router.post('/example', (req, res) => {
    // Handle JSON request
  });

  // Attach the router to the app
  app.use('/', router);

  return router;
};
