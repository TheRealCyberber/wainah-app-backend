const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: {type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, 
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number], 
      required: true
    }
  },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['lost', 'found'], required: true},
  picture: { type: String},
  isClaimed: { type: Boolean, default: false }
}, {
    timestamps: true
})

const Item = mongoose.model('Item', itemSchema)
module.exports = Item