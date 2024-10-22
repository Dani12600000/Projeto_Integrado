import React from "react";

// Componente de avaliação por estrelas
const StarRating = ({ rating, setRating }) => {
  // Função para definir a avaliação com base na estrela clicada
  const handleStarClick = (newRating) => {
    setRating(newRating); // Atualiza a avaliação
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleStarClick(star)}
          style={{
            fontSize: "2rem",
            cursor: "pointer",
            color: star <= rating ? "#ffc107" : "#e4e5e9", // Estrela preenchida ou vazia
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
