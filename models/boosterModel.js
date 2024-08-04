const mongoose = require('mongoose');

const boosterSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide a coach name'] },
  game: { type: String, required: [true, 'Please provide a game'] },
  rank: { type: String, required: [true, 'Please provide a coach rank'] },
  lanes: [{ type: String }],
  champions: [{ type: String }],
  rating: { type: Number, required: [true, 'Please provide a rating'] },
  language: [{ type: String, required: [true, 'Please provide a language'] }],
  recommended: { type: Boolean },
  image: { type: String },
});

const Booster = mongoose.model('Booster', boosterSchema);
module.exports = Booster;
