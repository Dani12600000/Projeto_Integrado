// models/Game.js
const mongoose = require('mongoose');

// Definir o esquema do jogo
const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// Criar o modelo Game com base no esquema
const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;
