// src/app/manga/[id]/capitulo/[number]/page.js
import ReaderUI from "@/components/ReaderUI";

// Helpers estáveis
const trimSlashEnd = (s) => (s && s.endsWith("/") ? s.slice(0, -1) : s);
const trimSlashStart = (s) => (s && s.startsWith("/") ? s.slice(1) : s);
const joinUrl = (base, part) =>
  `${trimSlashEnd(base || "")}/${trimSlashStart(part || "")}`;

const buildFileUrl = (apiBase, rawPath) => {
  if (!rawPath) return "";
  if (/^https?:\/\//i.test(rawPath)) return rawPath;              // absoluta
  if (rawPath.startsWith("/files")) return joinUrl(apiBase, rawPath); // /files/...
  return joinUrl(apiBase, joinUrl("/files", rawPath));               // relativo -> /files/rel
};

export default async function ReaderPage({ params }) {
  // ✅ Next 15
  const { id: mangaId, number } = await params;

  // backend em 4000
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  let manga = null;
  let pages = [];

  try {
    const mangaUrl = joinUrl(apiBase, `/mangas/${mangaId}`);
    const pagesUrl = joinUrl(apiBase, `/mangas/${mangaId}/chapters/${number}/pages`);
    console.log("[ReaderPage] GET", mangaUrl, "&&", pagesUrl);

    const [mangaRes, pagesRes] = await Promise.all([
      fetch(mangaUrl, { cache: "no-store" }),
      fetch(pagesUrl, { cache: "no-store" }),
    ]);

    if (mangaRes.ok) {
      manga = await mangaRes.json();
    }

    if (pagesRes.ok) {
      const data = await pagesRes.json().catch(() => ({}));
      const imgs = Array.isArray(data?.images) ? data.images : [];
      pages = imgs.map((it) => ({
        ...it,
        src: buildFileUrl(apiBase, it.url || it.src || ""),
      }));
    }
  } catch (e) {
    console.error("[ReaderPage] erro:", e);
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
          <div key={p.id ?? `${p.order}-${p.src}`} className="w-full overflow-hidden rounded">
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
