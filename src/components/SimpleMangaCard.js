"use client";
import { useState } from 'react';
import ChapterUpload from './ChapterUpload';

export default function SimpleMangaCard({ manga, onEdit, onDelete, onUploadCover, onUploadChapter }) {
  const [showChapterUpload, setShowChapterUpload] = useState(false);
  const [coverFile, setCoverFile] = useState(null);

  const filesBase = process.env.NEXT_PUBLIC_FILES_URL ?? "http://localhost:3000";

  const getCoverSrc = () => {
    if (coverFile) {
      return URL.createObjectURL(coverFile);
    }
    if (manga.coverUrl || manga.cover || manga.capa) {
      const path = manga.coverUrl || manga.cover || manga.capa;
      if (typeof path === "string" && path.startsWith("http")) {
        return path; // já é URL completa
      }
      return `${filesBase}${path.startsWith("/") ? "" : "/"}${path}`;
    }
    return null;
  };

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

  const handleUploadChapter = async (mangaId, number, title, pages) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
      
      // Primeiro criar o capítulo
      const chapterRes = await fetch(`${apiBase}/mangas/${mangaId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...onUploadChapter.getAuthHeaders()
        },
        body: JSON.stringify({ number: Number(number), title: title || null }),
      });

      if (!chapterRes.ok) {
        throw new Error('Falha ao criar capítulo');
      }

      // Depois fazer upload das páginas
      const form = new FormData();
      pages.forEach(page => form.append('pages', page));

      const pagesRes = await fetch(`${apiBase}/mangas/${mangaId}/chapters/${number}/pages`, {
        method: 'POST',
        headers: onUploadChapter.getAuthHeaders(),
        body: form,
      });

      if (!pagesRes.ok) {
        throw new Error('Falha ao enviar páginas');
      }

      // Atualizar a lista
      onUploadChapter.refreshMangas();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <>
      <div className="bg-black/20 rounded-lg p-4 border border-white/10 hover:border-white/20 transition">
        {/* Thumbnail da capa */}
        <div className="mb-3">
          {getCoverSrc() ? (
            <img
              src={getCoverSrc()}
              alt={`Capa de ${manga.title}`}
              className="w-full h-40 object-cover rounded-md border border-white/20"
            />
          ) : (
            <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-sm text-gray-500 rounded-md">
              Sem capa
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold line-clamp-2 flex-1 mr-2">{manga.title}</h3>
          <div className="flex gap-1 flex-shrink-0">
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
        
        {/* Synopsis */}
        {manga.synopsis && (
          <p className="text-sm text-gray-300 line-clamp-2 mb-3">{manga.synopsis}</p>
        )}
        
        {/* Genres */}
        {manga.genres && (
          <div className="text-xs text-gray-400 mb-3">
            {manga.genres.split(',').map((genre, i) => (
              <span key={i} className="inline-block bg-gray-700 px-2 py-1 rounded mr-1 mb-1">
                {genre.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Status and Chapters */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <span className={`px-2 py-1 rounded ${getStatusColor(manga.status)}`}>
            {getStatusText(manga.status)}
          </span>
          <span className="text-gray-400">
            {manga.totalChapters || 0} capítulos
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* Cover Upload */}
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
                className="block w-full bg-green-500 hover:bg-green-400 transition text-black text-center py-2 px-3 rounded cursor-pointer text-sm border border-green-400"
              >
                📷 {coverFile ? coverFile.name : 'Selecionar Capa'}
              </label>
            </div>
            {coverFile && (
              <button
                onClick={() => {
                  onUploadCover(manga.id, coverFile);
                  setCoverFile(null);
                }}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded text-sm transition"
              >
                📤 Enviar Capa
              </button>
            )}
          </div>

          {/* Chapter Upload */}
          <button
            onClick={() => setShowChapterUpload(true)}
            className="w-full bg-purple-500 hover:bg-purple-400 text-white py-2 px-3 rounded text-sm transition"
          >
            📄 Adicionar Capítulo
          </button>
        </div>
      </div>

      {/* Chapter Upload Modal */}
      {showChapterUpload && (
        <ChapterUpload
          mangaId={manga.id}
          onUpload={handleUploadChapter}
          onClose={() => setShowChapterUpload(false)}
          onUploadChapter={onUploadChapter}
        />
      )}
    </>
  );
}
