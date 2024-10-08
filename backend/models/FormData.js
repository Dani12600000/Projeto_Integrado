const mongoose = require("mongoose");

const FormDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }], // Adicionando o campo favorites
});

const FormDataModel = mongoose.model("log_reg_form", FormDataSchema);

module.exports = FormDataModel;
