const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: String,
  rating: Number,
  image: String,
  description: String,
  year: Number,
  categories: [String],
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "FormData" },
      rating: Number,
      comment: String,
    },
  ], // Array para armazenar avaliações de diferentes usuários
});

const GameModel = mongoose.model("Game", gameSchema);

module.exports = GameModel;
