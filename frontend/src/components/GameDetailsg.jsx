import { useParams } from 'react-router-dom';

const GameDetails = () => {
  const { id } = useParams();

  

  // Aqui você buscaria os dados do jogo a partir do ID
  // Este é um exemplo estático, mas você pode buscar de uma API ou contexto
  const game = {
    id: 1,
    title: 'Game 1',
    rating: 4.5,
    description: 'Descrição do jogo 1...',
    image: 'url_do_jogo_1',
  };

  return (
    <div>
      <h1>{game.title}</h1>
      <img src={game.image} alt={game.title} style={{ width: '300px' }} />
      <p>Avaliação: {game.rating}</p>
      <p>{game.description}</p>
    </div>
  );
};

export default GameDetails;