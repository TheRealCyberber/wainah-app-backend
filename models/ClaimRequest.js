const mongoose = require('mongoose');

const claimRequestSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  message: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
  picture: { type: String }
}, {
  timestamps: true
})

const ClaimRequest = mongoose.model('ClaimRequest', claimRequestSchema)
module.exports = ClaimRequest