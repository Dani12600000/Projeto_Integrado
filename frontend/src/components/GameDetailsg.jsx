import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const GameDetails = () => {
  const { id } = useParams(); // ID do jogo
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isFavorited, setIsFavorited] = useState(false); // Controle para verificar se o jogo é favorito
  const navigate = useNavigate();

  // Função para buscar detalhes do jogo
  const fetchGameDetails = async (gameId) => {
    try {
      const response = await axios.get(`http://localhost:3001/games/${gameId}`);
      setGame(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do jogo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para verificar se o jogo é favorito
  const checkIfFavorited = async (gameId, userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/favorites/${userId}`
      );
      if (response.data.some((game) => game._id === gameId)) {
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Erro ao verificar favoritos:", error);
    }
  };

  // Função para adicionar ou remover um jogo dos favoritos
  const handleFavoriteToggle = async () => {
    try {
      await axios.post("http://localhost:3001/favorites", {
        userId,
        gameId: id,
      });
      setIsFavorited(!isFavorited); // Alterna o estado
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserId) {
      setUserId(storedUserId); // Seta o ID do usuário
      checkIfFavorited(id, storedUserId); // Verifica se o jogo já é favorito
    }
    fetchGameDetails(id); // Busca os detalhes do jogo usando o ID
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))",
        minHeight: "100vh", // O elemento terá pelo menos a altura da janela
        height: "auto", // Permite que o elemento cresça se o conteúdo ultrapassar 100vh
      }}
      className="d-flex flex-column"
    >
      <header className="d-flex justify-content-between align-items-center p-3">
        <div>
          <Link to="/">
            <img
              src="https://raw.githubusercontent.com/Dani12600000/Projeto_Integrado/refs/heads/main/frontend/DaniLike_Games.jpg"
              alt="Logo"
              style={{ height: "50px" }}
            />
          </Link>
        </div>
        <div>
          {userName ? (
            <>
              <span className="text-light me-3">Welcome, {userName}</span>
              <button className="btn btn-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary me-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-center">
        {loading ? (
          <p>Carregando detalhes do jogo...</p>
        ) : game ? (
          <>
            <h1>{game.title}</h1>
            <img src={game.image} alt={game.title} style={{ width: "300px" }} />
            <p>Avaliação: {game.rating}⭐</p>
            <p>{game.description}</p>
            <p>{game.ano}</p>
            {userId && ( // Mostrar botão de favoritar apenas para usuários logados
              <button
                className={`btn ${isFavorited ? "btn-danger" : "btn-success"}`}
                onClick={handleFavoriteToggle}
              >
                {isFavorited
                  ? "Remover dos Favoritos"
                  : "Adicionar aos Favoritos"}
              </button>
            )}
          </>
        ) : (
          <p>Jogo não encontrado.</p>
        )}
      </main>
      <br />
    </div>
  );
};

export default GameDetails;
