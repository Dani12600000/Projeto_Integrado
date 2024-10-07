import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Exemplo de dados de jogos. Você pode buscar esses dados de uma API.
  const games = [
    { id: 1, title: 'Game 1', rating: 4.5, image: 'https://via.placeholder.com/100' },
    { id: 2, title: 'Game 2', rating: 4.0, image: 'https://via.placeholder.com/100' },
    { id: 3, title: 'Game 3', rating: 5.0, image: 'https://via.placeholder.com/100' },
  ];

  useEffect(() => {
    // Verifica se o usuário está logado e obtém o nome do usuário do localStorage
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name); // Seta o nome do utilizador
    }
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
        <div className="game-list d-flex flex-wrap justify-content-center">
          {games.map(game => (
            <div key={game.id} className="game-item m-3 text-center">
              <h3>{game.title}</h3>
              <p>Avaliação: {game.rating}</p>
              <Link to={`/game/${game.id}`}>
                <img src={game.image} alt={game.title} style={{ width: '100px' }} />
                <p>Ver detalhes</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
