const calculatePrice = require('./../utils/calculate');
const calculateCoachPrice = require('./../utils/calculateCoach');
const Coach = require('../models/coachModel');
const coachOrderModel = require('../models/coachOrderModel');
const boostOrderModel = require('../models/boostOrderModel');

const sendEmail = require('./../utils/email');
const stripe = require('stripe')(
  'sk_test_51PKegpJgnjmSEwtWzSLGgusDnp4w9jqfNplnuREYazayY8Q5RlpjwoLGsWZtHwz3O5pjmHkzG7IqoPWuXAHv2HhR00AUbWvaH8'
);
const endpointSecret =
  'whsec_8a11da344c6fda38c001d9c5204c52a0f04ef17fdd808e01b6cf815650ae815d';
const URL = 'https://boosters-6o9zbxwis-merkius-projects.vercel.app';
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

  let price, totalPrice, discountFinal;

  if (req.body.boostType) {
    ({ price, totalPrice, discountFinal } = calculatePrice(req.body));
  } else {
    ({ price, totalPrice, discountFinal } = await calculateCoachPrice(
      req.body
    ));
  }
  const data = { ...req.body, price, totalPrice, discountFinal };

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Example Product',
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${URL}/payment?success=true`,
    cancel_url: `${URL}/payment?canceled=true`,
    // success_url: `http://localhost:5173/payment?success=true`,
    // cancel_url: `http://localhost:5173/payment?canceled=true`,
    metadata: {
      body: JSON.stringify(data),
      userId: userId,
    },
  });
  // res.redirect(303, session.url);
  // console.log('Created session:', session);

  res.json({ url: session.url });
};

exports.webhookCheckout = async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
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
      console.log('data', data);
      const message = `Thank you for your order ${name}. We've received your payment.
        We appreciate that you've chosen Boosters Den for serving your needs.
        If you've any questions or need further assistance, contact our team on Discord

        Best Regards,
        Boosters Den Team`;

      await sendEmail({
        email: email,
        fullName: name,
        subject: 'Your payment was successfully processed',
        message,
      });

      if (data.boostType) {
        console.log('boostType');
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
          price,
          discountFinal,
          totalPrice,
        });
        console.log('newBoostOrder', newBoostOrder);

        try {
          await newBoostOrder.save();
          console.log('newBoostOrder', newBoostOrder);
        } catch (err) {
          console.error('Error creating boost order:', err);
          return res.status(400).json({
            status: 'fail',
            message: err.message,
          });
        }
      } else {
        console.log('coachType');
        const { _id, hours, priority, server } = data;
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
          console.log('newOrder', newOrder);
        } catch (err) {
          res.status(400).json({
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
