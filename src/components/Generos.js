// components/Generos.js
const Generos = ({ generos }) => {
  // Trata diferentes formatos de gêneros
  let genres = [];
  
  if (generos) {
    if (Array.isArray(generos)) {
      genres = generos;
    } else if (typeof generos === 'string') {
      // Se for string, divide por vírgula
      genres = generos.split(',').map(g => g.trim()).filter(g => g);
    }
  }
  
  // Fallback se não houver gêneros
  if (genres.length === 0) {
    genres = ['Ação', 'Aventura', 'Fantasia'];
  }

  return (
    <div className="tags mt-4">
      {genres.map((genero, index) => (
        <span
          key={index}
          className="bg-purple-600 px-3 py-1 rounded text-sm mr-2"
        >
          {genero}
        </span>
      ))}
    </div>
  );
};

export default Generos;
