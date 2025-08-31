// components/MiniCard.js
const MiniCard = ({ avaliacao, status, views, totalCapitulos }) => {
  // Mock de dados, caso não sejam fornecidos
  const rating = avaliacao || 9.3;
  const statStatus = status || "Em andamento";
  const statViews = views || 123456;
  const statTotalChapters = totalCapitulos || 120;

  return (
    
    <div className="stats grid grid-cols-2 gap-4 mt-6">
      <div className="stat bg-gray-800 p-4 rounded">
        <strong>{rating}⭐</strong>
        <div>Avaliação</div>
      </div>
      <div className="stat bg-gray-800 p-4 rounded">
        <strong>{statStatus}</strong>
        <div>Status</div>
      </div>
      <div className="stat bg-gray-800 p-4 rounded">
        <strong>{statViews}</strong>
        <div>Views</div>
      </div>
      <div className="stat bg-gray-800 p-4 rounded">
        <strong>{statTotalChapters}</strong>
        <div>Capítulos</div>
      </div>
    </div>
  );
};

export default MiniCard;
