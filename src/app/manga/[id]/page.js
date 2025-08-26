// src/app/manga/[id]/page.js
import Image from "next/image";

export default async function MangaPage({ params }) {
  const { id } = params;

  // 🔥 Buscar o mangá na API
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  let manga = null;

  try {
    const res = await fetch(`${apiBase}/mangas/${id}`, { cache: "no-store" });
    if (res.ok) {
      manga = await res.json();
    }
  } catch (err) {
    console.error("Erro ao buscar mangá:", err);
  }

  if (!manga) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-white">
        <h1 className="text-xl font-bold">Mangá não encontrado ❌</h1>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 text-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Capa */}
        <div className="relative w-60 h-80 flex-shrink-0">
          <Image
            src={
              manga.coverUrl?.startsWith("http")
                ? manga.coverUrl
                : `${apiBase}${manga.coverUrl}`
            }
            alt={manga.title}
            fill
            className="object-cover rounded shadow"
          />
        </div>

        {/* Informações */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{manga.title}</h1>
          {manga.synopsis && (
            <p className="mt-4 text-gray-300">{manga.synopsis}</p>
          )}
          <div className="mt-6">
            <span className="bg-purple-600 px-3 py-1 rounded text-sm">
              ID: {manga.id}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
