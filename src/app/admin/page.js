"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import AdminStats from "../../components/AdminStats";
import SimpleMangaCard from "../../components/SimpleMangaCard";
import ProtectedRoute from "../../components/ProtectedRoute";

// Desabilitar prerenderização estática
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
  const { getAuthHeaders } = useAuth();

  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [statusFilter, setStatusFilter] = useState("all");

  // Form states
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genres, setGenres] = useState("");

  // Edit modal states
  const [editingManga, setEditingManga] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);



  // Stats
  const [stats, setStats] = useState({
    total: 0,
    withCover: 0,
    withChapters: 0,
    completed: 0
  });

  const refreshMangas = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/mangas`, { 
        cache: "no-store",
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setMangas(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const withCover = data?.filter(m => m.coverUrl)?.length || 0;
      const withChapters = data?.filter(m => m.totalChapters > 0)?.length || 0;
      const completed = data?.filter(m => m.status === 'completed')?.length || 0;
      
      setStats({ total, withCover, withChapters, completed });
    } catch (e) {
      console.error(e);
    }
  }, [apiBase, getAuthHeaders]);

  useEffect(() => {
    refreshMangas();
  }, [refreshMangas]);



  // Filter and paginate mangas
  const filteredMangas = mangas.filter(manga => {
    const matchesSearch = manga.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manga.synopsis?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || manga.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMangas.length / itemsPerPage);
  const paginatedMangas = filteredMangas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function createManga(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/mangas`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ title, synopsis, genres }),
      });
      if (!res.ok) throw new Error("Falha ao criar mangá");
      
      const newManga = await res.json();
      
      setTitle("");
      setSynopsis("");
      setGenres("");
      await refreshMangas();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateManga(e) {
    e.preventDefault();
    if (!editingManga?.id) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/mangas/${editingManga.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          title: editingManga.title,
          synopsis: editingManga.synopsis,
          genres: editingManga.genres,
          status: editingManga.status
        }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar");
      setShowEditModal(false);
      setEditingManga(null);
      await refreshMangas();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteManga(mangaId) {
    if (!confirm("Tem certeza que deseja excluir este mangá?")) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/mangas/${mangaId}`, { 
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.status !== 204) throw new Error("Falha ao excluir");
      await refreshMangas();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadCover(mangaId, file) {
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("cover", file);
      const res = await fetch(`${apiBase}/upload/mangas/${mangaId}/cover`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      if (!res.ok) throw new Error("Falha no upload da capa");
      await refreshMangas();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }



  function openEditModal(manga) {
    setEditingManga({ ...manga });
    setShowEditModal(true);
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-7xl mx-auto p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link href="/" className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded">← Home</Link>
        </div>

      {/* Stats Cards */}
      <AdminStats stats={stats} />

      {error && (
        <div className="bg-red-600/60 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      {/* Create new manga */}
      <section className="bg-white/5 rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Criar Novo Mangá</h2>
        <form onSubmit={createManga} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="w-full bg-black/20 border border-white/20 rounded px-3 py-2"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
          <input
            className="w-full bg-black/20 border border-white/20 rounded px-3 py-2"
            placeholder="Gêneros (separados por vírgula)"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            maxLength={200}
          />
          <button disabled={loading} className="bg-emerald-500 hover:bg-emerald-400 transition text-black px-4 py-2 rounded disabled:opacity-60">
            {loading ? "Criando..." : "Criar Mangá"}
          </button>
        </form>
        <div className="mt-3">
          <textarea
            className="w-full bg-black/20 border border-white/20 rounded px-3 py-2"
            placeholder="Sinopse (opcional)"
            rows={3}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            maxLength={500}
          />
          <div className="text-xs text-gray-400 mt-1 text-right">
            {synopsis.length}/500
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="bg-white/5 rounded p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Gerenciar Mangás</h2>
          <div className="text-sm text-gray-300">
            {filteredMangas.length} de {mangas.length} mangás
          </div>
        </div>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar por título ou sinopse..."
            className="flex-1 bg-black/20 border border-white/20 rounded px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-black/20 border border-white/20 rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="ongoing">Em Andamento</option>
            <option value="completed">Concluído</option>
            <option value="paused">Pausado</option>
          </select>
          <button onClick={refreshMangas} className="bg-blue-500 hover:bg-blue-400 transition px-4 py-2 rounded">
            Atualizar
          </button>
        </div>

        {/* Manga cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedMangas.map((manga) => (
            <SimpleMangaCard
              key={manga.id}
              manga={manga}
              onEdit={openEditModal}
              onDelete={deleteManga}
              onUploadCover={uploadCover}
              onUploadChapter={{ getAuthHeaders, refreshMangas }}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        )}
      </section>

      {/* Edit Modal */}
      {showEditModal && editingManga && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Mangá</h3>
            <form onSubmit={updateManga} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Título</label>
                <input
                  className="w-full bg-black/30 border border-white/20 rounded px-3 py-2"
                  value={editingManga.title || ''}
                  onChange={(e) => setEditingManga({...editingManga, title: e.target.value})}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  className="w-full bg-black/30 border border-white/20 rounded px-3 py-2"
                  value={editingManga.status || 'ongoing'}
                  onChange={(e) => setEditingManga({...editingManga, status: e.target.value})}
                >
                  <option value="ongoing">Em Andamento</option>
                  <option value="completed">Concluído</option>
                  <option value="paused">Pausado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Gêneros</label>
                <input
                  className="w-full bg-black/30 border border-white/20 rounded px-3 py-2"
                  value={editingManga.genres || ''}
                  onChange={(e) => setEditingManga({...editingManga, genres: e.target.value})}
                  placeholder="Ação, Aventura, Comédia"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Sinopse</label>
                <textarea
                  className="w-full bg-black/30 border border-white/20 rounded px-3 py-2"
                  rows={3}
                  value={editingManga.synopsis || ''}
                  onChange={(e) => setEditingManga({...editingManga, synopsis: e.target.value})}
                  maxLength={500}
                />
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {(editingManga.synopsis || '').length}/500
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 transition text-black px-4 py-2 rounded disabled:opacity-60"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 transition px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}


