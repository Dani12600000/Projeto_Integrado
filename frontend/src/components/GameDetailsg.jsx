import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const GameDetails = () => {
  const { id } = useParams(); // Pega o ID do jogo da URL
  const [userName, setUserName] = useState('');
  const [game, setGame] = useState(null); // Estado para armazenar os dados do jogo
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Função para buscar os dados do jogo do MongoDB
  const fetchGameDetails = async (gameId) => {
    try {
      const response = await axios.get(`http://localhost:3001/games/${gameId}`); // Certifique-se de que essa rota existe
      setGame(response.data); // Define o jogo no estado
    } catch (error) {
      console.error('Erro ao buscar detalhes do jogo:', error);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  useEffect(() => {
    fetchGameDetails(id);

    // Verifica se o usuário está logado e obtém o nome do usuário do localStorage
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name); // Seta o nome do utilizador
    }
  }, [id]);

  const handleLogout = () => {
    // Limpa os dados do usuário do localStorage
    localStorage.removeItem('userId'); // Limpa o ID do usuário
    localStorage.removeItem('userName'); // Limpa o nome do usuário
  };

  return (
    <div style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))", height: "100vh" }} className="d-flex flex-column">
      <header className="d-flex justify-content-between align-items-center p-3">
        <div>
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

      <main className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-center">
        {loading ? (
          <p>Carregando detalhes do jogo...</p> // Mensagem de carregamento
        ) : game ? (
          <>
            <h1>{game.title}</h1>
            <img src={game.image} alt={game.title} style={{ width: '300px' }} />
            <p>Avaliação: {game.rating}</p>
            <p>{game.description}</p>
          </>
        ) : (
          <p>Jogo não encontrado.</p> // Mensagem caso o jogo não seja encontrado
        )}
      </main>
    </div>
  );
};

export default GameDetails;