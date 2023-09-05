const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
  warningId: {
    type: Number,
    unique: true,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Warning', warningSchema);