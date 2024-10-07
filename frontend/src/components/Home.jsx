// Home.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

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
          <img src="/DaniLike_Games.jpg" alt="Logo" style={{ height: '50px' }} />
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
      <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
        {userName ? (
          <>
            <h1>Welcome, {userName}!</h1>
            <p>You have successfully logged in.</p>
          </>
        ) : (
          <>
            <h1>Welcome to Dan Games reviews</h1>
            <p>You can explore the reviews of other players without logging in.</p>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
