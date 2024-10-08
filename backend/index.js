const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');
const GameModel = require('./models/Game'); // Modelo do jogo no MongoDB

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/utilizadores', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rota para registro de utilizadores
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  FormDataModel.findOne({ email: email })
    .then(user => {
      if (user) {
        res.json("Already registered");
      } else {
        FormDataModel.create(req.body)
          .then(log_reg_form => res.json(log_reg_form))
          .catch(err => res.json(err));
      }
    });
});

// Rota para login de utilizadores
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  FormDataModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          // Enviar sucesso junto com o ID e nome do usuário
          res.json({ status: "Success", id: user._id, name: user.name });
        } else {
          res.json({ status: "Wrong password" });
        }
      } else {
        res.json({ status: "No records found!" });
      }
    });
});

// Rota para buscar os detalhes de um jogo pelo ID
app.get('/games/:id', (req, res) => {
  const gameId = req.params.id;

  // Busca o jogo no MongoDB pelo ID
  GameModel.findById(gameId)
    .then(game => {
      if (game) {
        res.json(game); // Retorna os detalhes do jogo
      } else {
        res.status(404).json({ message: 'Jogo não encontrado.' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Erro ao buscar o jogo.', error });
    });
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
  console.log("Server listening on http://localhost:3001");
});
