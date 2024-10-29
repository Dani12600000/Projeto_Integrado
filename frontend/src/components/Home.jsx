import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; // Para fazer a requisição ao backend

const Home = () => {
  const [userName, setUserName] = useState("");
  const [games, setGames] = useState([]); // Armazena os jogos da base de dados
  const [filteredGames, setFilteredGames] = useState([]); // Armazena os jogos filtrados
  const [loading, setLoading] = useState(true); // Controla o carregamento dos dados
  const [searchTerm, setSearchTerm] = useState(""); // Armazena o termo da procura
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o utilizador está logado e obtém o nome do utilizador do localStorage
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name); // Seta o nome do utilizador
    }

    // Faz a requisição para encontrar os jogos do MongoDB
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
        console.error("Erro ao encontrar jogos:", error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    // Filtra os jogos com base no termo de procura
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
        backgroundImage: "linear-gradient(135deg, #1b2838, #1c3a54, #2a475e)",
        minHeight: "100vh",
        height: "auto",
      }}
      className="d-flex flex-column"
    >
      <header className="d-flex justify-content-between align-items-center p-3">
        <div>
          {/* Logo que redireciona para a página home */}
          <Link to="/">
            <img
              src="https://raw.githubusercontent.com/Dani12600000/Projeto_Integrado/refs/heads/main/frontend/DaniLike_Games.png"
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
          <p>Carregando jogos...</p> // Mostra mensagem de carregamento enquanto os dados não chegam
        ) : (
          <div className="container">
            <div className="row">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <div
                    key={game._id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                  >
                    <div className="card h-100 text-center">
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
                        <Link to={`/game/${game._id}`} className="btn btn-info">
                          Ver detalhes
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum jogo encontrado.</p> // Caso não haja jogos na base de dados
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
