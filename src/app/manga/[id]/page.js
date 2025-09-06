// src/app/manga/[id]/page.js
import Image from "next/image";
import Generos from "../../../components/Generos";
import MiniCard from "../../../components/MiniCard";
import ChaptersList from "../../../components/ChaptersList";
import SimilarList from "../../../components/SimilarList";
import Navbar from "@/components/Navbar"; // ajuste o nome do arquivo se necessário

// Helpers estáveis
const trimSlashEnd = (s) => (s && s.endsWith("/") ? s.slice(0, -1) : s);
const trimSlashStart = (s) => (s && s.startsWith("/") ? s.slice(1) : s);
const joinUrl = (base, part) =>
  `${trimSlashEnd(base || "")}/${trimSlashStart(part || "")}`;

const pickCoverPath = (m) =>
  (m?.coverUrl ??
    m?.cover ??
    m?.cover_path ??
    m?.coverPath ??
    m?.capa ??
    "").toString().trim();

const buildCoverUrl = (apiBase, rawPath, placeholder = "/vercel.svg") => {
  if (!rawPath) return placeholder;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;                 // absoluta
  if (rawPath.startsWith("/files")) return joinUrl(apiBase, rawPath); // /files/...
  return joinUrl(apiBase, joinUrl("/files", rawPath));                // relativo -> /files/rel
};

const normalizeGenres = (g) => {
  if (!g) return [];
  if (Array.isArray(g)) return g;
  if (typeof g === "string") return g.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
};

export default async function MangaPage({ params }) {
  // Next 15 exige await
  const { id } = await params;

  // backend em 4000
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  let manga = null;
  let chapters = []; // futuro: buscar do back

  try {
    const url = joinUrl(apiBase, `/mangas/${id}`);
    console.log("[MangaPage] GET", url);

    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      manga = await res.json();
    } else {
      const txt = await res.text().catch(() => "");
      console.warn("[MangaPage] not ok:", res.status, txt);
      throw new Error("Mangá não encontrado.");
    }

    // FUTURO (quando existir):
    // const r2 = await fetch(joinUrl(apiBase, `/mangas/${id}/chapters`), { cache: "no-store" });
    // if (r2.ok) chapters = await r2.json();
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

  const coverUrl = buildCoverUrl(apiBase, pickCoverPath(manga));
  const genresArr = normalizeGenres(manga.genres);

  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 text-white">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Capa */}
          <div className="relative w-60 h-80 flex-shrink-0">
            <Image
              src={coverUrl}
              alt={manga.title}
              fill
              className="object-cover rounded shadow"
              priority
            />
          </div>

          {/* Informações */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{manga.title}</h1>

            {manga.synopsis && (
              <p className="mt-4 text-gray-300">{manga.synopsis}</p>
            )}

            {/* Gêneros */}
            <Generos generos={genresArr} />

            {/* Mini Cards (rating, status, views, total) */}
            <MiniCard
              avaliacao={manga.rating}
              status={manga.status}
              views={manga.views}
              totalCapitulos={manga.totalChapters}
            />

            {/* ID (debug) */}
            <div className="mt-4">
              <span className="bg-purple-600 px-3 py-1 rounded text-sm">
                ID: {manga.id}
              </span>
            </div>
          </div>
        </div>

        {/* Capítulos */}
        <ChaptersList
          mangaId={manga.id}
          chapters={chapters}
          totalChapters={manga.totalChapters}
        />

        {/* Semelhantes */}
        <SimilarList />
      </main>
    </div>
  );
}
