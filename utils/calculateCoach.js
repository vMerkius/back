const Coach = require('../models/coachModel');

const calculateCoachPrice = async (data) => {
  const { _id, hours, server, priority } = data;
  let totalPrice = 0;
  const coach = await Coach.findById(_id);
  if (!coach) {
    return res.status(404).json({
      status: 'fail',
      message: 'No coach found with that ID',
    });
  }
  totalPrice += coach.price * hours;

  if (priority) {
    totalPrice *= 1.2;
  }

  const price = 0.8 * totalPrice;

  return {
    price: price.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    discountFinal: (totalPrice - price).toFixed(2),
  };
};

module.exports = calculateCoachPrice;
