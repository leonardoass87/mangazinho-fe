// src/components/Carousel.js
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Carousel() {
  const [mangas, setMangas] = useState([]);
  const [idx, setIdx] = useState(0);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const filesBase = process.env.NEXT_PUBLIC_FILES_URL;
  const placeholder = "/vercel.svg";

  useEffect(() => {
    (async () => {
      try {
        const url = `${apiBase}/mangas`;
        console.log("📡 Chamando API do Carousel:", url); // 🔍 log da URL
        const res = await fetch(url);

        if (!res.ok) {
          // se não veio JSON, loga status e texto
          const text = await res.text();
          console.error("❌ Erro na resposta da API:", res.status, text);
          return;
        }

        const data = await res.json();
        // últimos 5 publicados (já vem DESC no backend)
        setMangas((data || []).slice(0, 5));
      } catch (e) {
        console.error("Carousel fetch erro:", e);
      }
    })();
  }, [apiBase]);

  // autoplay 10s
  useEffect(() => {
    if (mangas.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % mangas.length), 10000);
    return () => clearInterval(t);
  }, [mangas.length]);

  if (!mangas.length) return null;

  const m = mangas[idx];
  const coverSrc = (u) =>
    u ? (u.startsWith("http") ? u : `${filesBase}${u}`) : placeholder;

  return (
    <section className="bg-zinc-800 text-white py-6 px-4 md:px-8 overflow-hidden relative rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Últimos Mangás Publicados
      </h2>

      <div className="relative overflow-hidden rounded-lg h-[380px] md:h-[440px]">
        {/* fundo blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-md brightness-50 scale-110"
          style={{ backgroundImage: `url(${coverSrc(m.coverUrl)})` }}
        />

        {/* conteúdo */}
        <div className="relative z-10 flex flex-col md:flex-row h-full px-2 sm:px-6 items-center justify-between">
          <div className="text-left max-w-xl">
            <h3 className="text-3xl font-bold drop-shadow">{m.title}</h3>
            {m.synopsis && (
              <p className="mt-4 text-gray-200">{m.synopsis}</p>
            )}
            <a
              href={`/manga/${m.id}`}
              className="inline-block mt-6 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300"
            >
              Começar Leitura →
            </a>
          </div>

          {/* capa recortada (desktop) */}
          <div className="hidden md:block w-[240px] h-[340px] relative">
            <div
              className="absolute inset-0 rounded shadow-lg overflow-hidden"
              style={{
                clipPath:
                  "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <Image
                src={coverSrc(m.coverUrl)}
                alt={m.title}
                fill
                sizes="240px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* bolinhas */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {mangas.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === idx ? "bg-white" : "bg-gray-500"
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
