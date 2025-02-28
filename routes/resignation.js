const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureHR } = require('../middleware/auth');
const Resignation = require('../models/Resignation');
const nodemailer = require('nodemailer');

// Submit resignation request
router.post('/submit', ensureAuthenticated, (req, res) => {
  const { intendedLastWorkingDay, reason } = req.body;

  const newResignation = new Resignation({
    employee: req.user.id,
    intendedLastWorkingDay,
    reason
  });

  newResignation.save()
    .then(resignation => res.status(201).json(resignation))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Review resignation requests (HR only)
router.get('/review', ensureAuthenticated, ensureHR, (req, res) => {
  Resignation.find({ status: 'Pending' })
    .populate('employee', ['username'])
    .then(resignations => res.json(resignations))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Approve or reject resignation request (HR only)
router.post('/review/:id', ensureAuthenticated, ensureHR, (req, res) => {
  const { status, exitDate } = req.body;

  Resignation.findById(req.params.id)
    .then(resignation => {
      if (!resignation) {
        return res.status(404).json({ error: 'Resignation request not found' });
      }

      resignation.status = status;
      resignation.exitDate = status === 'Approved' ? exitDate : null;

      resignation.save()
        .then(updatedResignation => {
          // Send notification to employee
          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'your-email@gmail.com',
              pass: 'your-email-password'
            }
          });

          const mailOptions = {
            from: 'your-email@gmail.com',
            to: updatedResignation.employee.username,
            subject: 'Resignation Request Update',
            text: `Your resignation request has been ${status}.`
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            }
            console.log('Email sent: ' + info.response);
          });

          res.json(updatedResignation);
        })
        .catch(err => res.status(400).json({ error: err.message }));
    })
    .catch(err => res.status(400).json({ error: err.message }));
});

module.exports = router;
