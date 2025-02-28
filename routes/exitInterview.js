const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureHR } = require('../middleware/auth');
const ExitInterview = require('./models/ExitInterview');

// Access Exit Interview (for Employees)
router.get('/access', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'Employee') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Logic to get the exit interview questions
  res.json({
    questions: [
      'Why are you leaving the company?',
      'What did you like most about working here?',
      'What did you like least about working here?',
      'How can we improve the workplace?'
    ]
  });
});

// Submit Exit Interview (for Employees)
router.post('/submit', ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'Employee') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const newExitInterview = new ExitInterview({
    employee: req.user.id,
    responses: req.body.responses
  });

  newExitInterview.save()
    .then(exitInterview => res.status(201).json(exitInterview))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Review Exit Interviews (for HR only)
router.get('/review', ensureAuthenticated, ensureHR, (req, res) => {
  ExitInterview.find()
    .populate('employee', ['username'])
    .then(exitInterviews => res.json(exitInterviews))
    .catch(err => res.status(400).json({ error: err.message }));
});

module.exports = router;
