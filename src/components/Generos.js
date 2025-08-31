// components/Generos.js
const Generos = ({ generos }) => {
  // Mock de gêneros, caso não haja dados
  const genres = generos || ['Ação', 'Aventura', 'Fantasia'];

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
