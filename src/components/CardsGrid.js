// src/components/CardsGrid.js
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CardsGrid() {
  const [mangas, setMangas] = useState([]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const placeholder = "/placeholder-cover.jpg";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase}/mangas`);
        const data = await res.json();
        setMangas(data || []);
      } catch (e) {
        console.error("Erro ao buscar mangás:", e);
      }
    })();
  }, [apiBase]);

  if (!mangas.length) return <div className="text-gray-400">Ainda não há mangás publicados.</div>;

  return (
    // 🔥 sem padding aqui
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {mangas.map((m) => {
        const src = m.coverUrl
          ? (m.coverUrl.startsWith("http") ? m.coverUrl : `${apiBase}${m.coverUrl}`)
          : placeholder;

        return (
          <article
            key={m.id}
            className="bg-white/5 rounded-lg overflow-hidden shadow hover:-translate-y-0.5 hover:shadow-lg transition"
          >
            <div className="relative w-full h-64">
              <Image
                src={src}
                alt={m.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-white line-clamp-1">{m.title}</h3>
              {m.synopsis && (
                <p className="text-sm text-gray-300 line-clamp-2 mt-1">{m.synopsis}</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
