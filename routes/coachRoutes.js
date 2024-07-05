const express = require('express');
const coachController = require('../controllers/coachController');

const router = express.Router();

router
  .route('/')
  .post(coachController.createCoach)
  .get(coachController.getAllCoaches);
router.route('/paging').get(coachController.getCoachesPaging);
router.route('/recommended').get(coachController.getRecommended);
router.route('/:id').get(coachController.getCoachById);

router.post('/', coachController.createCoach);

router.get('/', coachController.getAllCoaches);

module.exports = router;
