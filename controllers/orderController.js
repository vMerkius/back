const boostOrderModel = require('../models/boostOrderModel');
const coachOrderModel = require('../models/coachOrderModel');
const Coach = require('../models/coachModel');
const calculatePrice = require('./../utils/calculate');
const calculateCoachPrice = require('../utils/calculateCoach');
const discountCode = require('../utils/discount');
const calculateTftPrice = require('../utils/calculateTft');

exports.price = async (req, res, next) => {
  try {
    const { price, totalPrice, discountFinal, time } = calculatePrice(req.body);

    res.status(200).json({
      status: 200,
      data: {
        price: price,
        totalPrice: totalPrice,
        estimated: time,
        discount: discountFinal,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.priceCoach = async (req, res, next) => {
  try {
    const { price, totalPrice, discountFinal } = await calculateCoachPrice(
      req.body
    );
    res.status(200).json({
      status: 200,
      data: {
        price: price,
        totalPrice: totalPrice,
        discount: discountFinal,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.priceTft = async (req, res, next) => {
  try {
    const { price, totalPrice, discountFinal } = await calculateTftPrice(
      req.body
    );
    res.status(200).json({
      status: 200,
      data: {
        price: price,
        totalPrice: totalPrice,
        discount: discountFinal,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.orderCoach = async (req, res) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'User is not logged in',
    });
  }
  const { _id, hours, priority, server } = req.body;
  const userToken = token.split('.')[1];
  const userId = JSON.parse(Buffer.from(userToken, 'base64').toString()).id;

  const coach = await Coach.findById(_id);
  if (!coach) {
    return res.status(404).json({
      status: 'fail',
      message: 'No coach found with that ID',
    });
  }

  const newOrder = await coachOrderModel.create({
    userId,
    coachId: _id,
    priority,
    server,
    hours,
    done: false,
  });
  try {
    await newOrder.save();
    res.status(201).json({
      status: 'success',
      data: {
        coach: newOrder,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.checkDiscount = async (req, res) => {
  try {
    const { discount } = req.body;
    console.log(req.body);
    const index = discountCode.findIndex((el) => el.code === discount);

    if (index === -1) {
      return res.status(404).json({
        status: 'fail',
        message: 'Discount code not found',
      });
    }
    console.log(discountCode[index]);

    res.status(200).json({
      status: 'success',
      data: discountCode[index],
      percent: discountCode[index].discount,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
