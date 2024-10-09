import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AddGame = () => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]); // Armazena as categorias
  const [categoryInput, setCategoryInput] = useState(""); // Input para a nova categoria
  const [year, setYear] = useState(""); // Campo para o ano do jogo
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Verifica se o usuário está logado e obtém o nome do usuário do localStorage
  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name); // Define o nome do usuário
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  // Função para adicionar categorias
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (categoryInput && !categories.includes(categoryInput)) {
      setCategories([...categories, categoryInput]); // Adiciona a nova categoria à lista
      setCategoryInput(""); // Limpa o campo de input
    }
  };

  // Função para remover uma categoria
  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(
      categories.filter((category) => category !== categoryToRemove)
    );
  };

  // Função para adicionar um jogo à base de dados
  const handleAddGame = async (e) => {
    e.preventDefault();

    // Validação simples para garantir que os campos estejam preenchidos
    if (
      !title ||
      !rating ||
      !image ||
      !description ||
      !year ||
      categories.length === 0
    ) {
      setErrorMessage(
        "Todos os campos, incluindo ano e categorias, são obrigatórios."
      );
      return;
    }

    try {
      const newGame = { title, rating, image, description, categories, year };
      const response = await axios.post("http://localhost:3001/games", newGame);

      if (response.status === 200 || response.status === 201) {
        navigate("/"); // Redireciona para a home após adicionar o jogo com sucesso
      } else {
        setErrorMessage("Erro ao adicionar o jogo.");
      }
    } catch (error) {
      console.error("Erro ao adicionar o jogo:", error);
      setErrorMessage("Erro ao adicionar o jogo. Verifique o backend.");
    }
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
        <h2>Adicionar Novo Jogo</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <form
          onSubmit={handleAddGame}
          className="d-flex flex-column"
          style={{ width: "300px" }}
        >
          <input
            type="text"
            placeholder="Título do jogo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control mb-3"
            required
          />
          <input
            type="text"
            placeholder="Avaliação"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="form-control mb-3"
            required
          />
          <input
            type="text"
            placeholder="URL da imagem"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="form-control mb-3"
            required
          />
          <textarea
            placeholder="Descrição do jogo"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control mb-3"
            rows="4"
            required
          />
          <input
            type="number"
            placeholder="Ano de lançamento"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="form-control mb-3"
            required
          />
          <div className="mb-3">
            <input
              type="text"
              placeholder="Nova categoria"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="form-control mb-2"
            />
            <button
              className="btn btn-primary mb-3"
              onClick={handleAddCategory}
            >
              Adicionar Categoria
            </button>
            <div>
              {categories.map((category, index) => (
                <span key={index} className="badge bg-info me-2">
                  {category}
                  <button
                    type="button"
                    className="btn-close ms-1"
                    onClick={() => handleRemoveCategory(category)}
                  ></button>
                </span>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            Adicionar Jogo
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddGame;
