// src/components/Carousel.js
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Carousel() {
  const [mangas, setMangas] = useState([]);
  const [index, setIndex] = useState(0);

  // Carrega últimos 5 mangás da API
  useEffect(() => {
    async function fetchMangas() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/mangas`);
        const data = await res.json();
        setMangas((data || []).slice(0, 5)); // pega no máximo 5
      } catch (e) {
        console.error("Erro ao carregar mangás:", e);
      }
    }
    fetchMangas();
  }, []);

  // Auto-play sem depender de função externa (evita warning de deps)
  useEffect(() => {
    if (mangas.length > 1) {
      const id = setInterval(() => {
        setIndex((i) => (i + 1) % mangas.length);
      }, 4000);
      return () => clearInterval(id);
    }
  }, [mangas]);

  const prev = () =>
    setIndex((i) => (mangas.length ? (i - 1 + mangas.length) % mangas.length : 0));
  const next = () =>
    setIndex((i) => (mangas.length ? (i + 1) % mangas.length : 0));

  if (mangas.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-6 text-center text-gray-500">
        Nenhum mangá publicado ainda.
      </div>
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  return (
    <div className="relative max-w-6xl mx-auto mt-6 overflow-hidden rounded-lg shadow-lg">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {mangas.map((m) => {
          const src = m.coverUrl?.startsWith("http")
            ? m.coverUrl
            : `${apiBase}${m.coverUrl ?? ""}`;

          return (
            <div key={m.id} className="min-w-full h-72 relative text-white">
              <Image
                src={src}
                alt={m.title}
                fill
                sizes="100vw"
                className="object-cover brightness-75"
                priority={m === mangas[0]}
              />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold">{m.title}</h3>
                {m.synopsis && <p className="text-sm">{m.synopsis}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {mangas.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white text-2xl px-3 py-1 rounded-full"
            aria-label="Anterior"
          >
            ❮
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white text-2xl px-3 py-1 rounded-full"
            aria-label="Próximo"
          >
            ❯
          </button>
        </>
      )}
    </div>
  );
}
