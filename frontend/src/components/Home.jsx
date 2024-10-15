import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; // Para fazer a requisição ao backend

const Home = () => {
  const [userName, setUserName] = useState("");
  const [games, setGames] = useState([]); // Armazena os jogos da base de dados
  const [filteredGames, setFilteredGames] = useState([]); // Armazena os jogos filtrados
  const [loading, setLoading] = useState(true); // Controla o carregamento dos dados
  const [searchTerm, setSearchTerm] = useState(""); // Armazena o termo de busca
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o utilizador está logado e obtém o nome do utilizador do localStorage
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name); // Seta o nome do utilizador
    }

    // Faz a requisição para buscar os jogos do MongoDB
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:3001/games"); // Rota que retorna os jogos
        // Ordena os jogos pela avaliação antes de definir o estado
        const sortedGames = response.data
          .map((game) => {
            const ratings = game.reviews.map((review) => review.rating);
            const averageRating =
              ratings.length > 0
                ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(
                    1
                  )
                : game.rating; // Usa a rating padrão se não houver avaliações
            return { ...game, averageRating }; // Adiciona a média ao jogo
          })
          .sort((a, b) => b.averageRating - a.averageRating);

        setGames(sortedGames); // Seta os jogos ordenados no estado
        setFilteredGames(sortedGames); // Seta os jogos filtrados inicialmente como todos os jogos
        setLoading(false); // Desativa o estado de carregamento
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    // Filtra os jogos com base no termo de busca
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
    // Limpa os dados do utilizador do localStorage
    localStorage.removeItem("userId"); // Limpa o ID do utilizador
    localStorage.removeItem("userName"); // Limpa o nome do utilizador
    navigate("/login");
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))",
        height: "100vh",
      }}
      className="d-flex flex-column"
    >
      <header className="d-flex justify-content-between align-items-center p-3">
        <div>
          {/* Logo que redireciona para a página home */}
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
              <span className="text-light me-3">Olá, {userName}</span>
              <Link to="/Profile" className="btn btn-primary me-2">
                Perfil
              </Link>
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

      <section className="d-flex flex-column align-items-center">
        <h2>Jogos Disponíveis</h2>
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
          <p>Carregando jogos...</p> // Mostra mensagem de carregamento enquanto os dados não chegam
        ) : (
          <div className="game-list d-flex flex-wrap justify-content-center">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <div key={game._id} className="game-item m-3 text-center">
                  <h3>{game.title}</h3>
                  <p>Avaliação: {game.averageRating}⭐</p>{" "}
                  {/* Exibe a média ou a rating padrão */}
                  <Link to={`/game/${game._id}`}>
                    <img
                      src={game.image}
                      alt={game.title}
                      style={{ width: "100px" }}
                    />
                    <p>Ver detalhes</p>
                  </Link>
                  <p>Favoritos: {game.favoriteCount}</p>
                </div>
              ))
            ) : (
              <p>Nenhum jogo encontrado.</p> // Caso não haja jogos na base de dados
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
