const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const FormDataModel = require("./models/FormData");
const GameModel = require("./models/Game"); // Modelo do jogo no MongoDB

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect("mongodb://localhost:27017/review_games_website", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rota para registro de utilizadores
app.post("/register", (req, res) => {
  const { email, password, name } = req.body; // Adicionei o campo nome no registro
  FormDataModel.findOne({ email: email }).then((user) => {
    if (user) {
      res.json("Already registered");
    } else {
      FormDataModel.create(req.body)
        .then((log_reg_form) => res.json(log_reg_form))
        .catch((err) =>
          res.status(400).json({ message: "Erro ao registrar", error: err })
        );
    }
  });
});

// Rota para login de utilizadores
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  FormDataModel.findOne({ email: email }).then((user) => {
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

// Rota para buscar todos os jogos
app.get("/games", (req, res) => {
  GameModel.find()
    .then((games) => res.json(games)) // Retorna a lista de jogos
    .catch((error) =>
      res.status(500).json({ message: "Erro ao buscar jogos", error })
    );
});

// Rota para buscar os detalhes de um jogo pelo ID
app.get("/games/:id", (req, res) => {
  const gameId = req.params.id;

  // Busca o jogo no MongoDB pelo ID
  GameModel.findById(gameId)
    .then((game) => {
      if (game) {
        res.json(game); // Retorna os detalhes do jogo
      } else {
        res.status(404).json({ message: "Jogo não encontrado." });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Erro ao buscar o jogo.", error });
    });
});

// Rota para adicionar um novo jogo
app.post("/games", (req, res) => {
  const { title, rating, image, description } = req.body;

  // Verifica se todos os campos estão preenchidos
  if (!title || !rating || !image || !description) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  // Cria um novo jogo
  GameModel.create(req.body)
    .then((newGame) => res.status(201).json(newGame)) // Retorna o jogo criado
    .catch((err) =>
      res.status(400).json({ message: "Erro ao adicionar o jogo", error: err })
    );
});

// Rota para adicionar ou remover favoritos
app.post("/favorites", (req, res) => {
  const { userId, gameId } = req.body;

  FormDataModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Verifica se o jogo já está nos favoritos
      const index = user.favorites.indexOf(gameId);
      if (index === -1) {
        // Se não estiver, adiciona
        user.favorites.push(gameId);
      } else {
        // Se estiver, remove
        user.favorites.splice(index, 1);
      }

      return user.save(); // Salva as mudanças
    })
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) =>
      res.status(500).json({ message: "Erro ao atualizar favoritos.", err })
    );
});

// Rota para buscar jogos favoritos do usuário
app.get("/favorites/:userId", (req, res) => {
  const { userId } = req.params;

  FormDataModel.findById(userId)
    .populate("favorites") // Popula os dados dos jogos favoritos
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
      res.json(user.favorites); // Retorna os jogos favoritos
    })
    .catch((err) =>
      res.status(500).json({ message: "Erro ao buscar favoritos.", err })
    );
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
  console.log("Server listening on http://localhost:3001");
});
