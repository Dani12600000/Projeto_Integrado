import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }

    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:3001/games");
        const sortedGames = response.data
          .map((game) => {
            const ratings = game.reviews.map((review) => review.rating);
            const averageRating =
              ratings.length > 0
                ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(
                    1
                  )
                : game.rating;
            return { ...game, averageRating };
          })
          .sort((a, b) => b.averageRating - a.averageRating);

        setGames(sortedGames);
        setFilteredGames(sortedGames);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao encontrar jogos:", error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const filtered = games.filter(
      (game) =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.categories.some((category) =>
          category.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredGames(filtered);
  }, [searchTerm, games]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleDeleteGame = async (gameId) => {
    const confirmDelete = window.confirm(
      "Tem a certeza que deseja apagar este jogo?"
    );

    if (!confirmDelete) {
      return; // Cancela a exclusão
    }

    try {
      console.log("Apagando jogo com ID:", gameId);

      // Apaga o jogo
      const deleteResponse = await axios.delete(
        `http://localhost:3001/games/${gameId}`
      );
      console.log("Resposta da exclusão do jogo:", deleteResponse.data);

      // Remove o jogo dos favoritos
      const updateResponse = await axios.put(
        "http://localhost:3001/users/remove-favorite",
        { gameId }
      );
      console.log(
        "Resposta da atualização dos favoritos:",
        updateResponse.data
      );

      // Atualiza os jogos localmente
      setGames((prevGames) => prevGames.filter((game) => game._id !== gameId));
      setFilteredGames((prevFiltered) =>
        prevFiltered.filter((game) => game._id !== gameId)
      );

      alert("Jogo apagado com sucesso!");
    } catch (error) {
      console.error("Erro ao apagar jogo:", error);
      alert("Não foi possível apagar o jogo.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(135deg, #1b2838, #1c3a54, #2a475e)",
        minHeight: "100vh",
        height: "auto",
      }}
      className="d-flex flex-column"
    >
      <header className="d-flex justify-content-between align-items-center p-3">
        <div>
          <Link to="/">
            <img
              src="https://raw.githubusercontent.com/Dani12600000/Projeto_Integrado/refs/heads/main/frontend/DaniLike_Games.png"
              alt="Logo"
              style={{ height: "85px" }}
            />
          </Link>
        </div>
        <div>
          {userName ? (
            <>
              <span className="text-light me-3">Olá, {userName}</span>
              <Link to="/Profile" className="btn btn-primary me-2">
                Perfil
              </Link>
              <button className="btn btn-light" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary me-2">
                Iniciar Sessão
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="d-flex flex-column align-items-center">
        <h2 className="text-white">Jogos Disponíveis</h2>
        <div className="mb-3 col-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control mb-3"
          />
        </div>
        {loading ? (
          <p>Carregando jogos...</p>
        ) : (
          <div className="container">
            <div className="row">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <div
                    key={game._id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <div
                      className="card h-100 text-center"
                      style={{ boxShadow: "10px 14px 8px rgba(0, 0, 0, 0.5)" }}
                    >
                      <img
                        src={game.image}
                        alt={game.title}
                        className="card-img-top"
                        style={{ maxHeight: "250px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{game.title}</h5>
                        <p className="card-text">
                          Avaliação: {game.averageRating}⭐
                        </p>
                        <p className="card-text">
                          Favoritos: {game.favoriteCount}
                        </p>
                        <div className="d-flex justify-content-center gap-2">
                          <Link
                            to={`/game/${game._id}`}
                            className="btn btn-info"
                          >
                            Ver detalhes
                          </Link>
                          {userName === "Admin" && (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteGame(game._id)}
                            >
                              Apagar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum jogo encontrado.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
