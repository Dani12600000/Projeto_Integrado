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
        // Enviar sucesso junto com o ID e nome do utilizador
        res.json({ status: "Success", id: user._id, name: user.name });
      } else {
        res.json({ status: "Wrong password" });
      }
    } else {
      res.json({ status: "No records found!" });
    }
  });
});

// Rota para buscar todos os jogos com o número de favoritos de cada um
app.get("/games", async (req, res) => {
  try {
    // Busca todos os jogos
    const games = await GameModel.find();

    // Para cada jogo, conta o número de utilizadors que o favoritaram
    const gamesWithFavoriteCounts = await Promise.all(
      games.map(async (game) => {
        const count = await FormDataModel.countDocuments({
          favorites: game._id, // Conta quantos utilizadors têm esse jogo nos favoritos
        });
        return {
          ...game.toObject(), // Converte o documento do jogo em objeto JS
          favoriteCount: count, // Adiciona a contagem de favoritos
        };
      })
    );

    // Retorna os jogos com a contagem de favoritos
    res.json(gamesWithFavoriteCounts);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar jogos", error });
  }
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
  const { title, rating, image, description, year, categories } = req.body;

  // Verifica se todos os campos estão preenchidos
  if (!title || !rating || !image || !description || !year || !categories) {
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
        return res.status(404).json({ message: "utilizador não encontrado." });
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

// Rota para buscar jogos favoritos do utilizador
app.get("/favorites/:userId", (req, res) => {
  const { userId } = req.params;

  FormDataModel.findById(userId)
    .populate("favorites") // Popula os dados dos jogos favoritos
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "utilizador não encontrado." });
      }
      res.json(user.favorites); // Retorna os jogos favoritos
    })
    .catch((err) =>
      res.status(500).json({ message: "Erro ao buscar favoritos.", err })
    );
});

// Rota para adicionar ou atualizar avaliação de um jogo
app.post("/games/:id/review", (req, res) => {
  const { userId, rating, comment } = req.body; // Dados da avaliação
  const gameId = req.params.id;

  // Verifica se a avaliação tem os dados necessários
  if (!userId || !rating) {
    return res
      .status(400)
      .json({ message: "utilizador e avaliação são obrigatórios." });
  }

  GameModel.findById(gameId)
    .then((game) => {
      if (!game) {
        return res.status(404).json({ message: "Jogo não encontrado." });
      }

      // Verifica se o utilizador já avaliou o jogo
      const existingReviewIndex = game.reviews.findIndex(
        (review) => review.userId.toString() === userId
      );

      if (existingReviewIndex !== -1) {
        // Se o utilizador já tiver uma avaliação, atualiza
        game.reviews[existingReviewIndex].rating = rating;
        game.reviews[existingReviewIndex].comment = comment || "";
      } else {
        // Caso contrário, adiciona uma nova avaliação
        game.reviews.push({ userId, rating, comment });
      }

      return game.save(); // Salva as mudanças no jogo
    })
    .then((updatedGame) => res.json(updatedGame)) // Retorna o jogo atualizado
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Erro ao adicionar ou atualizar avaliação.", error })
    );
});

// Rota para apagar um jogo
app.delete("/games/:id", async (req, res) => {
  try {
    const gameId = req.params.id;

    // Remove o jogo da coleção de jogos
    await GameModel.findByIdAndDelete(gameId);

    res.status(200).send("Jogo apagado com sucesso!");
  } catch (error) {
    console.error("Erro ao apagar jogo:", error);
    res.status(500).send("Erro ao apagar jogo.");
  }
});

// Rota para remover o jogo dos favoritos dos utilizadores
app.put("/users/remove-favorite", async (req, res) => {
  const { gameId } = req.body;

  try {
    // Atualiza todos os utilizadores, removendo o jogo dos favoritos
    await FormDataModel.updateMany(
      { favorites: gameId },
      { $pull: { favorites: gameId } }
    );

    res.status(200).send("Jogo removido dos favoritos com sucesso!");
  } catch (error) {
    console.error("Erro ao remover jogo dos favoritos:", error);
    res.status(500).send("Erro ao remover jogo dos favoritos.");
  }
});

// Rota para atualizar os dados de um jogo
app.put("/games/:id", async (req, res) => {
  const gameId = req.params.id;
  const updatedData = req.body;

  try {
    // Atualiza o jogo no MongoDB
    const updatedGame = await GameModel.findByIdAndUpdate(gameId, updatedData, {
      new: true, // Retorna o jogo atualizado
    });

    if (!updatedGame) {
      return res.status(404).json({ message: "Jogo não encontrado." });
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o jogo.", error });
  }
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
  console.log("Server listening on http://localhost:3001");
});
