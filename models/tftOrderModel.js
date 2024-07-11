const mongoose = require('mongoose');

const tftOrderSchema = new mongoose.Schema({
  rankCurrent: {
    rank: { type: String, required: [true, 'Please provide a current rank'] },
    division: {
      type: String,
      required: [true, 'Please provide a current division'],
    },
    lp: {
      type: String,
      required: [true, 'Please provide current league points'],
    },
  },
  rankDesired: {
    rank: { type: String, required: [true, 'Please provide a desired rank'] },
    division: {
      type: String,
      required: [true, 'Please provide a desired division'],
    },
    lp: { type: String },
  },
  solo: { type: Boolean, required: true },
  streamed: { type: Boolean },
  chat: { type: Boolean },
  priority: { type: Boolean },
  additionalWin: { type: Boolean },
  mmrs: { type: String },
  discount: { type: String },
  price: { type: Number, required: [true, 'Please provide a price'] },
  discountFinal: { type: Number },
  totalPrice: { type: Number },
});

const TftOrder = mongoose.model('TftOrder', tftOrderSchema);
module.exports = TftOrder;
