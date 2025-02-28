const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect('your-mongodb-uri', { useNewUrlParser: true, useUnifiedTopology: true });

// Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/resignation', require('./routes/resignation'));
app.use('/exitInterview', require('./routes/exitInterview'));

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
