const calculatePrice = require('./../utils/calculate');
const calculateCoachPrice = require('./../utils/calculateCoach');
const Coach = require('../models/coachModel');
const coachOrderModel = require('../models/coachOrderModel');
const boostOrderModel = require('../models/boostOrderModel');
const tftOrderModel = require('../models/tftOrderModel');
const { sendOrderConfirmation } = require('./../utils/emailsec');

const sendEmail = require('./../utils/email');
const calculateTftPrice = require('../utils/calculateTft');

const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const STRIPE_ENDPOINT_KEY = process.env.STRIPE_ENDPOINT_KEY;

const stripe = require('stripe')(STRIPE_API_KEY);

const BASE_URL = process.env.BASE_URL;

exports.createCheckoutSession = async (req, res, next) => {
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
  const userToken = token.split('.')[1];
  const userId = JSON.parse(Buffer.from(userToken, 'base64').toString()).id;
  console.log('userId', userId);

  let price, totalPrice, discountFinal, type;

  if (req.body.boostType) {
    ({ price, totalPrice, discountFinal, time } = await calculatePrice(
      req.body
    ));
    type = 'Boosting';
  } else if (req.body.hours) {
    ({ price, totalPrice, discountFinal } = await calculateCoachPrice(
      req.body
    ));
    type = 'Coaching';
  } else {
    ({ price, totalPrice, discountFinal } = await calculateTftPrice(req.body));
    type = 'Boosting';
  }
  const data = { ...req.body, price, totalPrice, discountFinal };

  const rankCurrent = req.body.rankCurrent;
  const rankDesired = req.body.rankDesired;

  let productDataName;
  if(type === 'Boosting') {
    productDataName = `Boosting: ${rankCurrent.rank} ${rankCurrent.division}: ${rankCurrent.lp} - ${rankDesired.rank} ${rankDesired.division}: ${rankDesired.lp}  Discord: ${req.body.discord}`;
  }
  else if(type === 'Coaching') {
    productDataName = `Coaching: ${req.body.hours} hours  Discord: ${req.body.discord}`;
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: productDataName,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${BASE_URL}/payment?success=true`,
    cancel_url: `${BASE_URL}/payment?canceled=true`,
    metadata: {
      body: JSON.stringify(data),
      userId: userId,
    },
  });

  res.json({ url: session.url });
};

exports.webhookCheckout = async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, STRIPE_ENDPOINT_KEY);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const checkout = event.data.object;
      const email = checkout.customer_details.email;
      const name = checkout.customer_details.name;
      const data = JSON.parse(checkout.metadata.body);
      const userId = checkout.metadata.userId;
      console.log('Checkout session completed:', data);

      if (data.boostType) {
        const {
          boostType,
          rankCurrent,
          rankDesired,
          lane,
          champions,
          solo,
          streamed,
          chat,
          flash,
          priority,
          queue,
          additionalWin,
          mmrs,
          netWins,
          placements,
          discount,
          discord,
          price,
          discountFinal,
          totalPrice,
        } = data;

        const newBoostOrder = await boostOrderModel.create({
          userId,
          boostType,
          rankCurrent,
          rankDesired,
          lane,
          champions,
          solo,
          streamed,
          chat,
          flash,
          priority,
          queue,
          additionalWin,
          mmrs,
          netWins,
          placements,
          discount,
          discord,
          price,
          discountFinal,
          totalPrice,
        });

        try {
          await newBoostOrder.save();
          console.log('Checkout session completed:', data);

          await sendOrderConfirmation({
            email: email,
            name: name,
            dc: discord,
            type: "Boosting",
            price: price,
          });

        } catch (err) {
          console.error('Error creating boost order:', err);
          return res.status(400).json({
            status: 'fail',
            message: err.message,
          });
        }
      } else if (data.hours) {
        console.log('coachType');
        const {
          _id,
          hours,
          priority,
          server,

          price,
          discountFinal,
          totalPrice,
        } = data;
        const coach = await Coach.findById(_id);
        if (!coach) {
          return res.status(404).json({
            status: 'fail',
            message: 'No coach found with that ID',
          });
        }

        const newOrder = await coachOrderModel.create({
          price,
          discountFinal,
          totalPrice,
          userId,
          coachId: _id,
          priority,
          server,
          hours,
          done: false,
        });
        try {
          await newOrder.save();
          await sendOrderConfirmation({
            email: email,
            name: name,
            dc: discord,
            type: "Coaching",
            price: price,
          });
          console.log('newOrder', newOrder);
        } catch (err) {
          res.status(400).json({
            status: 'fail',
            message: err.message,
          });
        }
      } else {
        console.log('tft');
        const {
          rankCurrent,
          rankDesired,
          solo,
          streamed,
          chat,
          priority,
          additionalWin,
          mmrs,
          discount,
          discord,
          price,
          discountFinal,
          totalPrice,
        } = data;
        const newTftOrder = await tftOrderModel.create({
          rankCurrent,
          rankDesired,
          solo,
          streamed,
          chat,
          priority,
          additionalWin,
          mmrs,
          discount,
          discord,
          price,
          discountFinal,
          totalPrice,
        });

        try {
          await newTftOrder.save();

          await sendOrderConfirmation({
            email: email,
            name: name,
            dc: discord,
            type: "Boosting",
            price: price,
          });

          console.log('Checkout session completed:', data);
        } catch (err) {
          console.error('Error creating boost order:', err);
          return res.status(400).json({
            status: 'fail',
            message: err.message,
          });
        }
      }

      break;
    default:
  }

  res.status(200).json({ received: true });
};
