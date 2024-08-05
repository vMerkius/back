const mongoose = require('mongoose');

const coachOrderSchema = new mongoose.Schema({
  userId: { type: String, required: [true, 'Please provide a user ID'] },
  coachId: { type: String, required: [true, 'Please provide a coach ID'] },
  priority: { type: Boolean },
  server: { type: String, required: [true, 'Please provide a server'] },
  hours: { type: Number, required: [true, 'Please provide hours'] },
  discord: {
    type: String,
    required: [true, 'Please provide a Discord username'],
  },
  done: { type: Boolean },
  price: { type: Number },
  discountFinal: { type: Number },
  totalPrice: { type: Number },
});

const CoachOrder = mongoose.model('CoachOrder', coachOrderSchema);
module.exports = CoachOrder;
