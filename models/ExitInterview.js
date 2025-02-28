const mongoose = require('mongoose');

// Define the Exit Interview schema
const ExitInterviewSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: {
    type: Map,
    of: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Exit Interview model
const ExitInterview = mongoose.model('ExitInterview', ExitInterviewSchema);

module.exports = ExitInterview;
