const express = require('express');
const orderController = require('./../controllers/orderController');
const paymentController = require('./../controllers/paymentController');
const bodyParser = require('body-parser');

const router = express.Router();

router.post('/price', orderController.price);
router.post('/priceCoach', orderController.priceCoach);
router.post('/priceTft', orderController.priceTft);

router.post('/orderCoach', orderController.orderCoach);
router.post('/checkDiscount', orderController.checkDiscount);

router.post(
  '/create-checkout-session',
  paymentController.createCheckoutSession
);

router.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  paymentController.webhookCheckout
);

module.exports = router;
