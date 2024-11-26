import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const EditGame = () => {
  const { id } = useParams(); // Captura o ID do jogo da URL
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
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

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/games/${id}`);
        const { title, rating, image, description, categories, year } =
          response.data;
        setTitle(title);
        setRating(rating);
        setImage(image);
        setDescription(description);
        setCategories(categories || []);
        setYear(year);
      } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
      }
    };

    const fetchCategoriesFromGames = async () => {
      try {
        const response = await axios.get("http://localhost:3001/games");
        const allCategories = response.data.flatMap((game) => game.categories);
        const uniqueCategories = [...new Set(allCategories)];
        setSuggestedCategories(uniqueCategories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchGameDetails();
    fetchCategoriesFromGames();
  }, [id]);

  const handleCategoryInputChange = (e) => {
    const input = e.target.value;
    setCategoryInput(input);
    setFilteredSuggestions(
      input
        ? suggestedCategories.filter((category) =>
            category.toLowerCase().includes(input.toLowerCase())
          )
        : []
    );
  };

  const handleSelectSuggestion = (suggestion) => {
    if (!categories.includes(suggestion)) {
      setCategories([...categories, suggestion]);
    }
    setCategoryInput("");
    setFilteredSuggestions([]);
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

  const handleUpdateGame = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !rating ||
      !image ||
      !description ||
      !year ||
      !categories.length
    ) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const updatedGame = {
        title,
        rating,
        image,
        description,
        categories,
        year,
      };
      const response = await axios.put(
        `http://localhost:3001/games/${id}`,
        updatedGame
      );

      if (response.status === 200) {
        navigate("/");
      } else {
        setErrorMessage("Erro ao atualizar o jogo.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o jogo:", error);
      setErrorMessage("Erro ao atualizar o jogo. Verifique o backend.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(135deg, #1b2838, #1c3a54, #2a475e)",
        minHeight: "100vh",
      }}
      className="d-flex flex-column"
    >
      <header className="d-flex justify-content-between align-items-center p-3">
        <Link to="/">
          <img
            src="https://raw.githubusercontent.com/Dani12600000/Projeto_Integrado/refs/heads/main/frontend/DaniLike_Games.png"
            alt="Logo"
            style={{ height: "85px" }}
          />
        </Link>
        {userName && <span className="text-light">Olá, {userName}</span>}
      </header>
      <main className="d-flex flex-column align-items-center flex-grow-1">
        <h2 className="text-white">Editar Jogo</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <form
          onSubmit={handleUpdateGame}
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
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control mb-3"
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

            <div className="d-flex justify-content-center">
              <button
                type="button"
                onClick={handleAddCategory}
                className="btn btn-primary mb-2"
              >
                Adicionar Categoria
              </button>
            </div>

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
            Atualizar Jogo
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditGame;
