import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AddGame = () => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [suggestedCategories, setSuggestedCategories] = useState([]); // Categorias sugeridas
  const [filteredSuggestions, setFilteredSuggestions] = useState([]); // Sugestões filtradas
  const [categories, setCategories] = useState([]); // Categorias selecionadas para o jogo
  const [categoryInput, setCategoryInput] = useState(""); // Input para nova categoria
  const [year, setYear] = useState("");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  // Busca as categorias dos jogos existentes para sugestões
  useEffect(() => {
    const fetchCategoriesFromGames = async () => {
      try {
        const response = await axios.get("http://localhost:3001/games");
        const allCategories = response.data.flatMap((game) => game.categories);
        const uniqueCategories = [...new Set(allCategories)];
        setSuggestedCategories(uniqueCategories);
      } catch (error) {
        console.error("Erro ao buscar categorias dos jogos:", error);
      }
    };
    fetchCategoriesFromGames();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleAddCategory = () => {
    if (categoryInput && !categories.includes(categoryInput)) {
      setCategories([...categories, categoryInput]);
      setCategoryInput("");
      setFilteredSuggestions([]);
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(
      categories.filter((category) => category !== categoryToRemove)
    );
  };

  const handleCategoryInputChange = (e) => {
    const input = e.target.value;
    setCategoryInput(input);

    if (input) {
      const filtered = suggestedCategories.filter((category) =>
        category.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    if (!categories.includes(suggestion)) {
      setCategories([...categories, suggestion]);
    }
    setCategoryInput("");
    setFilteredSuggestions([]);
  };

  const handleAddGame = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !rating ||
      !image ||
      !description ||
      !year ||
      categories.length === 0
    ) {
      setErrorMessage(
        "Todos os campos são obrigatórios, incluindo categorias."
      );
      return;
    }

    try {
      const newGame = { title, rating, image, description, categories, year };
      const response = await axios.post("http://localhost:3001/games", newGame);

      if (response.status === 200 || response.status === 201) {
        navigate("/");
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
        backgroundImage: "linear-gradient(135deg, #1b2838, #1c3a54, #2a475e)",
        minHeight: "100vh",
        height: "100%",
      }}
      className="d-flex flex-column"
    >
      <header className="d-flex justify-content-between align-items-center p-3">
        <div>
          <Link to="/">
            <img
              src="https://raw.githubusercontent.com/Dani12600000/Projeto_Integrado/refs/heads/main/frontend/DaniLike_Games.png"
              alt="Logo"
              style={{ height: "85px" }}
            />
          </Link>
        </div>
        <div>
          {userName ? (
            <>
              <span className="text-light me-3">Olá, {userName}</span>
              <button className="btn btn-light" onClick={handleLogout}>
                Sair
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
        <h2 className="text-white">Adicionar Novo Jogo</h2>
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
          <div className="mb-3 position-relative">
            <input
              type="text"
              placeholder="Nova categoria"
              value={categoryInput}
              onChange={handleCategoryInputChange}
              className="form-control mb-2"
            />

            {/* Exibir sugestões apenas se houver opções filtradas */}
            {filteredSuggestions.length > 0 && (
              <div className="position-absolute w-100 bg-light border">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="p-2"
                    style={{ cursor: "pointer" }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn btn-primary mt-2"
              onClick={handleAddCategory}
              type="button"
            >
              Adicionar Categoria
            </button>
            <div className="mt-2">
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
