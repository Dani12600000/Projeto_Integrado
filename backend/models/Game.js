const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  categories: { type: [String], required: true }, // Categorias como array de strings
  year: { type: Number, required: true }, // Campo para o ano de lançamento
});

const GameModel = mongoose.model("Game", GameSchema);

module.exports = GameModel;
