const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/restaurantDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Pass 'app' to authRoutes
app.use('/', authRoutes(app));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// ... (existing code)

app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/login');
  } else {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
  }
});

// ... (existing code)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
