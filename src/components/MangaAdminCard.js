export default function MangaAdminCard({ 
  manga, 
  onEdit, 
  onDelete, 
  onUploadCover, 
  onCreateChapter, 
  onUploadPages,
  coverFile,
  setCoverFile,
  chapterNumber,
  setChapterNumber,
  pagesFiles,
  setPagesFiles,
  pagesChapterNumber,
  setPagesChapterNumber
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'paused': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'paused': return 'Pausado';
      default: return 'Em Andamento';
    }
  };

  return (
    <div className="bg-black/20 rounded-lg p-4 border border-white/10 hover:border-white/20 transition">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold line-clamp-2">{manga.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(manga)}
            className="text-xs bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded transition"
            title="Editar mangá"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(manga.id)}
            className="text-xs bg-red-500 hover:bg-red-400 px-2 py-1 rounded transition"
            title="Excluir mangá"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {manga.synopsis && (
        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{manga.synopsis}</p>
      )}
      
      {manga.genres && (
        <div className="text-xs text-gray-400 mb-3">
          {manga.genres.split(',').map((genre, i) => (
            <span key={i} className="inline-block bg-gray-700 px-2 py-1 rounded mr-1 mb-1">
              {genre.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Status and stats */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className={`px-2 py-1 rounded ${getStatusColor(manga.status)}`}>
          {getStatusText(manga.status)}
        </span>
        <span className="text-gray-400">
          {manga.totalChapters || 0} capítulos
        </span>
      </div>

      <div className="space-y-2">
        {/* Cover upload */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id={`cover-upload-${manga.id}`}
            />
            <label
              htmlFor={`cover-upload-${manga.id}`}
              className="block w-full bg-green-500 hover:bg-green-400 transition text-black text-center py-1 px-2 rounded cursor-pointer text-xs border border-green-400"
            >
              📷 Selecionar Capa
            </label>
          </div>
          {coverFile && (
            <div className="text-xs text-gray-300">
              {coverFile.name} selecionado
            </div>
          )}
          <button
            onClick={() => onUploadCover(manga.id)}
            disabled={!coverFile}
            className="w-full text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded disabled:opacity-60 border border-green-500 transition"
          >
            📤 Enviar Capa
          </button>
        </div>

        {/* Chapter creation */}
        <div className="flex gap-1">
          <input
            type="number"
            placeholder="Cap."
            className="flex-1 text-xs bg-black/30 border border-white/20 rounded px-2 py-1"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
            min={1}
          />
          <button
            onClick={() => onCreateChapter(manga.id)}
            disabled={!chapterNumber}
            className="text-xs bg-orange-500 hover:bg-orange-400 text-white px-2 py-1 rounded disabled:opacity-60 border border-orange-400 transition"
            title="Criar novo capítulo"
          >
            ➕
          </button>
        </div>

        {/* Pages upload */}
        <div className="space-y-2">
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Cap."
              className="flex-1 text-xs bg-black/30 border border-white/20 rounded px-2 py-1"
              value={pagesChapterNumber}
              onChange={(e) => setPagesChapterNumber(e.target.value)}
              min={1}
            />
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPagesFiles(Array.from(e.target.files || []))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id={`pages-upload-${manga.id}`}
              />
              <label
                htmlFor={`pages-upload-${manga.id}`}
                className="block w-full bg-purple-500 hover:bg-purple-400 transition text-white text-center py-1 px-2 rounded cursor-pointer text-xs border border-purple-400"
                title="Selecionar páginas"
              >
                📄
              </label>
            </div>
          </div>
          {pagesFiles.length > 0 && (
            <div className="text-xs text-gray-300">
              {pagesFiles.length} arquivo(s) selecionado(s)
            </div>
          )}
          <button
            onClick={() => onUploadPages(manga.id)}
            disabled={!pagesFiles.length || !pagesChapterNumber}
            className="w-full text-xs bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded disabled:opacity-60 border border-purple-500 transition"
          >
            📤 Enviar Páginas
          </button>
        </div>
      </div>
    </div>
  );
}
