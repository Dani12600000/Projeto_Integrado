import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios'; // Para fazer a requisição ao backend

const Home = () => {
  const [userName, setUserName] = useState('');
  const [games, setGames] = useState([]); // Armazena os jogos da base de dados
  const [loading, setLoading] = useState(true); // Controla o carregamento dos dados
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está logado e obtém o nome do usuário do localStorage
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name); // Seta o nome do utilizador
    }

    // Faz a requisição para buscar os jogos do MongoDB
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:3001/games'); // Rota que retorna os jogos
        // Ordena os jogos pela avaliação antes de definir o estado
        const sortedGames = response.data.sort((a, b) => b.rating - a.rating);
        setGames(sortedGames); // Seta os jogos ordenados no estado
        setLoading(false); // Desativa o estado de carregamento
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleLogout = () => {
    // Limpa os dados do usuário do localStorage
    localStorage.removeItem('userId'); // Limpa o ID do usuário
    localStorage.removeItem('userName'); // Limpa o nome do usuário
    navigate('/login');
  };

  return (
    <div style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))", height: "100vh" }} className="d-flex flex-column">
      <header className="d-flex justify-content-between align-items-center p-3">
        <div>
          {/* Logo que redireciona para a página home */}
          <Link to="/">
            <img src="https://raw.githubusercontent.com/Dani12600000/Projeto_Integrado/refs/heads/main/frontend/DaniLike_Games.jpg" alt="Logo" style={{ height: '50px' }} />
          </Link>
        </div>
        <div>
          {userName ? (
            <>
              <span className="text-light me-3">Welcome, {userName}</span>
              <button className="btn btn-light" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary me-2">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          )}
        </div>
      </header>

      <section className="d-flex flex-column align-items-center">
        <h2>Jogos Disponíveis</h2>
        {loading ? (
          <p>Carregando jogos...</p> // Mostra mensagem de carregamento enquanto os dados não chegam
        ) : (
          <div className="game-list d-flex flex-wrap justify-content-center">
            {games.length > 0 ? (
              games.map(game => (
                <div key={game._id} className="game-item m-3 text-center">
                  <h3>{game.title}</h3>
                  <p>Avaliação: {game.rating}⭐</p>
                  <Link to={`/game/${game._id}`}>
                    <img src={game.image} alt={game.title} style={{ width: '100px' }} />
                    <p>Ver detalhes</p>
                  </Link>
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