const mongoose = require('mongoose');

const boostOrderSchema = new mongoose.Schema({
  userId: { type: String, required: [true, 'Please provide a user ID'] },
  boostType: { type: String, required: [true, 'Please provide a boost type'] },
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
  lane: {
    primary: {
      type: String,
    },
    secondary: {
      type: String,
    },
  },
  champions: [{ type: String }],
  solo: { type: Boolean, required: true },
  streamed: { type: Boolean },
  chat: { type: Boolean },
  flash: { type: String },
  priority: { type: Boolean },
  queue: { type: String },
  additionalWin: { type: Boolean },
  mmrs: { type: String },
  netWins: { type: Number },
  placements: { type: Number },
  discount: { type: String },
  price: { type: Number, required: [true, 'Please provide a price'] },
  discountFinal: { type: Number },
  totalPrice: { type: Number },
});

const BoostOrder = mongoose.model('BoostOrder', boostOrderSchema);
module.exports = BoostOrder;
