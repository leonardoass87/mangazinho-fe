// src/app/manga/[id]/capitulo/[number]/page.js
// Use <img> for natural height rendering and simpler responsive behavior
import ReaderUI from "@/components/ReaderUI";

export default async function ReaderPage({ params }) {
  const { id: mangaId, number } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
  const filesBase = (process.env.NEXT_PUBLIC_FILES_URL ?? "http://localhost:3000") + "";

  let manga = null;
  let pages = [];

  try {
    const [mangaRes, pagesRes] = await Promise.all([
      fetch(`${apiBase}/mangas/${mangaId}`, { cache: "no-store" }),
      fetch(`${apiBase}/mangas/${mangaId}/chapters/${number}/pages`, { cache: "no-store" }),
    ]);

    if (mangaRes.ok) manga = await mangaRes.json();
    if (pagesRes.ok) {
      const data = await pagesRes.json();
      pages = (data?.images || []).map((it) => ({ ...it, src: it.url?.startsWith("http") ? it.url : `${filesBase}${it.url}` }));
    }
  } catch (e) {
    console.error(e);
  }

  if (!manga) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-white">
        <h1 className="text-xl font-bold">Capítulo não encontrado ❌</h1>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-2 sm:px-4 py-4 text-white">
      {/* UI helpers: progress bar + scroll-to-top */}
      <ReaderUI />
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <a href={`/manga/${manga.id}`} className="text-sm underline">← Voltar</a>
        <div className="text-xs sm:text-sm text-gray-300">Capítulo {number}</div>
      </div>

      <h1 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 leading-snug">
        {manga.title} — Capítulo {number}
      </h1>

      <div className="flex flex-col gap-3 sm:gap-4">
        {pages.length === 0 && (
          <div className="text-gray-300">Nenhuma página enviada para este capítulo.</div>
        )}
        {pages.map((p) => (
          <div key={p.id} className="w-full overflow-hidden rounded">
            <img
              src={p.src}
              alt={`Página ${p.order}`}
              className="w-full h-auto select-none"
              loading={p.order === 1 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </main>
  );
}


