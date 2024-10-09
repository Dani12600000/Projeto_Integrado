import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [favoriteGames, setFavoriteGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserName || !storedUserId) {
      // Se o usuário não estiver logado, redireciona para a página inicial
      navigate("/");
    } else {
      setUserName(storedUserName);
      setUserId(storedUserId);
      fetchFavoriteGames(storedUserId); // Busca os jogos favoritados
    }
  }, [navigate]);

  // Função para buscar os jogos favoritados
  const fetchFavoriteGames = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/favorites/${userId}`
      );
      setFavoriteGames(response.data); // Seta os jogos favoritados
    } catch (error) {
      console.error("Erro ao buscar jogos favoritados:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))",
        minHeight: "100vh",
        height: "auto",
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
        <h1>Olá, {userName}!</h1>
        <h2>Jogos Favoritados:</h2>
        {favoriteGames.length > 0 ? (
          <div className="game-list d-flex flex-wrap justify-content-center">
            {favoriteGames.map((game) => (
              <div key={game._id} className="game-item m-3 text-center">
                <h3>{game.title}</h3>
                <img
                  src={game.image}
                  alt={game.title}
                  style={{ width: "100px" }}
                />
                <p>Avaliação: {game.rating}⭐</p>
                <Link to={`/game/${game._id}`} className="btn btn-info">
                  Ver detalhes
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Você ainda não tem jogos favoritados.</p>
        )}
      </main>
      <br />
    </div>
  );
};

export default Profile;
