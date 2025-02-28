const mongoose = require('mongoose');

// Define the Resignation schema
const ResignationSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  intendedLastWorkingDay: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  exitDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Resignation model
const Resignation = mongoose.model('Resignation', ResignationSchema);

module.exports = Resignation;
