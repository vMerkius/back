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

/**
 * @swagger
 * /coaches:
 *   post:
 *     tags: [Coaches]
 *     summary: Create a new coach
 *     description: Creates a new coach with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - game
 *               - rank
 *               - rating
 *             properties:
 *               name:
 *                 type: string
 *                 description: The coach's full name.
 *                 example: 'Jane Doe'
 *               game:
 *                 type: string
 *                 description: The game the coach specializes in.
 *                 example: 'League of Legends'
 *               rank:
 *                 type: string
 *                 description: The coach's rank in the game.
 *                 example: 'Diamond'
 *               lanes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The lanes the coach specializes in.
 *                 example: ['Top', 'Mid']
 *               champions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The champions the coach specializes in.
 *                 example: ['Ahri', 'Zed']
 *               rating:
 *                 type: number
 *                 description: The coach's rating.
 *                 example: 4.5
 *               recommended:
 *                 type: boolean
 *                 description: Whether the coach is recommended.
 *                 example: true
 *     responses:
 *       201:
 *         description: Coach created successfully. Returns the coach's data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: 'Jane Doe'
 *                 game:
 *                   type: string
 *                   example: 'League of Legends'
 *                 rank:
 *                   type: string
 *                   example: 'Diamond'
 *                 lanes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ['Top', 'Mid']
 *                 champions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ['Ahri', 'Zed']
 *                 rating:
 *                   type: number
 *                   example: 4.5
 *                 recommended:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Error in coach creation data. Could be due to validation failure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Invalid input data'
 */
router.post('/', coachController.createCoach);

/**
 * @swagger
 * /coaches:
 *   get:
 *     tags: [Coaches]
 *     summary: Get all coaches
 *     description: Retrieves a list of all coaches.
 *     responses:
 *       200:
 *         description: A list of all coaches.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   description: The number of coaches returned.
 *                   example: 2
 *                 data:
 *                   type: object
 *                   properties:
 *                     coaches:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: 'Jane Doe'
 *                           game:
 *                             type: string
 *                             example: 'League of Legends'
 *                           rank:
 *                             type: string
 *                             example: 'Diamond'
 *                           lanes:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ['Top', 'Mid']
 *                           champions:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ['Ahri', 'Zed']
 *                           rating:
 *                             type: number
 *                             example: 4.5
 *                           recommended:
 *                             type: boolean
 *                             example: true
 *       400:
 *         description: Error in fetching coaches.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Unable to retrieve coaches'
 */
router.get('/', coachController.getAllCoaches);

module.exports = router;
