const Coach = require('../models/coachModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const URL = 'https://back-b-kzfc.onrender.com';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single('image');

exports.createCoach = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    }

    const {
      name,
      game,
      rank,
      lanes,
      champions,
      rating,
      language,
      recommended,
      price,
    } = req.body;

    let imagePath;
    if (req.file) {
      imagePath = `uploads/${req.file.filename}`;
    }

    const newCoach = new Coach({
      name,
      game,
      rank,
      lanes,
      champions,
      rating,
      language,
      recommended,
      image: imagePath,
      price,
    });

    try {
      await newCoach.save();
      res.status(201).json({
        status: 'success',
        data: {
          coach: newCoach,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    }
  });
};

exports.getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    const responseCoaches = coaches.map((coach) => ({
      ...coach.toObject(),
      imageUrl: coach.image ? `${URL}/${coach.image}` : null,
    }));

    res.status(200).json({
      status: 'success',
      results: coaches.length,
      data: {
        responseCoaches,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.getCoachesPaging = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const startIndex = (page - 1) * limit;

    const { name, game, rank, price, rating, lane, champion, language } =
      req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (game) filter.game = game;
    if (rank) filter.rank = rank;
    if (lane) filter.lanes = { $elemMatch: { $regex: lane, $options: 'i' } }; // Use elemMatch for case-insensitive match in arrays
    if (champion)
      filter.champions = { $elemMatch: { $regex: champion, $options: 'i' } };
    if (language)
      filter.language = { $elemMatch: { $regex: language, $options: 'i' } };

    let sortCriteria = {};
    if (price === 'lowest') {
      sortCriteria.price = 1;
    } else if (price === 'highest') {
      sortCriteria.price = -1;
    } else if (rating === 'highest') {
      sortCriteria.rating = -1;
    } else if (rating === 'lowest') {
      sortCriteria.rating = 1;
    }

    const coaches = await Coach.find(filter)
      .sort(sortCriteria)
      .skip(startIndex)
      .limit(limit);

    const responseCoaches = coaches.map((coach) => ({
      ...coach.toObject(),
      imageUrl: coach.image ? `${URL}/${coach.image}` : null,
    }));

    const totalCoaches = await Coach.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: responseCoaches.length,
      total: totalCoaches,
      data: {
        responseCoaches,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.getCoachById = async (req, res) => {
  try {
    const id = req.params.id;
    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({
        status: 'fail',
        message: 'No coach found with that ID',
      });
    }
    const responseCoach = {
      ...coach.toObject(),
      imageUrl: coach.image ? `${URL}/${coach.image}` : null,
    };
    res.status(200).json({
      status: 'success',
      data: {
        responseCoach,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getRecommended = async (req, res) => {
  try {
    const coaches = await Coach.aggregate([
      { $match: { recommended: true } },
      { $sample: { size: 4 } },
    ]);
    const responseCoaches = coaches.map((coach) => ({
      ...coach,
      imageUrl: coach.image ? `${URL}/${coach.image}` : null,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        responseCoaches,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
