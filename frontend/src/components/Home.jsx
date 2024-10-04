// Home.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está logado e obtém o nome do usuário do localStorage
    const name = localStorage.getItem('userName'); // Alterado aqui para pegar diretamente o nome
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
    <div style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }} className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
      {userName ? (
        <>
          <h1>Welcome, {userName}!</h1>
          <p>You have successfully logged in.</p>
          <button className="btn btn-light my-5" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h1>Welcome to Dan Games reviews</h1>
          <p>You can explore the reviews of other players without logging in.</p>
          <Link to="/login" className="btn btn-primary my-2">Login</Link>
          <Link to="/register" className="btn btn-secondary my-2">Register</Link>
        </>
      )}
    </div>
  );
};

export default Home;
