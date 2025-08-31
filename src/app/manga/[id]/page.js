// src/app/manga/[id]/page.js
import Image from "next/image";
import Generos from "../../../components/Generos";
import MiniCard from "../../../components/MiniCard";
import ChaptersList from "../../../components/ChaptersList";
import SimilarList from "../../../components/SimilarList";
import Navbar from "@/components/Navabar";
//import Comments from "../../../components/Comments";

export default async function MangaPage({ params }) {
  const { id } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
  const filesBase = (process.env.NEXT_PUBLIC_FILES_URL ?? "http://localhost:3000") + "";
  let manga = null;
  let chapters = []; // futuro: buscar do back

  try {
    const res = await fetch(`${apiBase}/mangas/${id}`, { cache: "no-store" });
    if (res.ok) {
      manga = await res.json();
    } else {
      throw new Error("Mangá não encontrado.");
    }

    // FUTURO (quando existir): buscar capítulos reais
    // const r2 = await fetch(`${apiBase}/mangas/${id}/chapters`, { cache: "no-store" });
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

  return (
    <div>
      <Navbar/>
    <main className="max-w-5xl mx-auto p-6 text-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Capa */}
        <div className="relative w-60 h-80 flex-shrink-0">
          <Image
            src={manga.coverUrl 
              ? (manga.coverUrl.startsWith("http") ? manga.coverUrl : `${filesBase}${manga.coverUrl}`)
              : "/vercel.svg"
            }
            alt={manga.title}
            fill
            className="object-cover rounded shadow"
            priority
          />
        </div>

        {/* Informações */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{manga.title}</h1>

          {manga.synopsis && <p className="mt-4 text-gray-300">{manga.synopsis}</p>}

          {/* Gêneros */}
          <Generos generos={manga.genres ?? []} />

          {/* Mini Cards (rating, status, views, total) */}
          <MiniCard
            avaliacao={manga.rating}
            status={manga.status}
            views={manga.views}
            totalCapitulos={manga.totalChapters}
          />

          {/* ID (debug) */}
          <div className="mt-4">
            <span className="bg-purple-600 px-3 py-1 rounded text-sm">ID: {manga.id}</span>
          </div>
        </div>
      </div>

      {/* Capítulos (usa capítulos reais se existir; senão, totalChapters) */}
      <ChaptersList
        mangaId={manga.id}
        chapters={chapters}
        totalChapters={manga.totalChapters}
      />

      {/* Semelhantes (placeholder agora) */}
      <SimilarList />

      {/* Comentários (estático agora) */}
      {/* <Comments /> */}
    </main>
    </div>
  );
}
