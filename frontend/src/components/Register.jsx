import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o utilizador já está logado
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/home"); // Redireciona para a página inicial
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3001/register", { name, email, password })
      .then((result) => {
        console.log(result);
        if (result.data === "Already registered") {
          alert("E-mail já registado! Por favor inicie sessão para continuar.");
          navigate("/login");
        } else {
          alert(
            "Conta criada com sucesso! Por favor inicie sessão para continuar."
          );
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
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
                style={{ height: "85px" }}
              />
            </Link>
          </div>
        </header>
        <div
          className="d-flex justify-content-center align-items-center text-center vh-95"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #1b2838, #1c3a54, #2a475e)",
          }}
        >
          <div className="bg-white p-3 rounded" style={{ width: "40%" }}>
            <h2 className="mb-3 text-primary">Criar conta</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label htmlFor="exampleInputname" className="form-label">
                  <strong>Name</strong>
                </label>
                <input
                  type="text"
                  placeholder="Introduza o seu nome"
                  className="form-control"
                  id="exampleInputname"
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  <strong>Email Id</strong>
                </label>
                <input
                  type="email"
                  placeholder="Introduza o seu email"
                  className="form-control"
                  id="exampleInputEmail1"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  <strong>Palavra-passe</strong>
                </label>
                <input
                  type="password"
                  placeholder="Introduza uma palavra-passe"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Registar
              </button>
            </form>

            <p className="container my-2">Já tem uma conta ?</p>
            <Link to="/login" className="btn btn-secondary">
              Iniciar sessão
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
