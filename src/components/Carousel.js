// src/components/Carousel.js
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

// Helpers estáveis (fora do componente)
const trimSlashEnd = (s) => (s && s.endsWith("/") ? s.slice(0, -1) : s);
const trimSlashStart = (s) => (s && s.startsWith("/") ? s.slice(1) : s);
const joinUrl = (base, part) =>
  `${trimSlashEnd(base || "")}/${trimSlashStart(part || "")}`;

// path pode vir absoluto, começar com /files ou ser relativo (ex: mangas/xxx/cover.jpg)
const buildCoverUrl = (apiBase, path, DEBUG, placeholder) => {
  if (!path) return placeholder;

  if (typeof path === "string" && /^https?:\/\//i.test(path)) {
    if (DEBUG) console.log("[Carousel] cover abs:", path);
    return path;
  }
  if (typeof path === "string" && path.startsWith("/files")) {
    const url = joinUrl(apiBase, path);
    if (DEBUG) console.log("[Carousel] cover rel(/files):", url);
    return url;
  }
  const url = joinUrl(apiBase, joinUrl("/files", path));
  if (DEBUG) console.log("[Carousel] cover rel:", url);
  return url;
};

export default function Carousel() {
  const [mangas, setMangas] = useState([]);
  const [idx, setIdx] = useState(0);

  const DEBUG =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_DEBUG === "true";

  // backend em 4000
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const placeholder = "/vercel.svg";

  useEffect(() => {
    (async () => {
      const url = joinUrl(apiBase, "/mangas");
      try {
        if (DEBUG) console.log("📡 [Carousel] GET", url);
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.warn("❌ [Carousel] /mangas not ok:", res.status, text);
          setMangas([]);
          return;
        }

        const data = await res.json().catch(() => []);
        const list = Array.isArray(data) ? data : [];
        // últimos 5 (assumindo que o backend já retorna ordenado)
        setMangas(list.slice(0, 5));
      } catch (e) {
        console.error("[Carousel] fetch erro:", e);
        setMangas([]);
      }
    })();
  }, [apiBase, DEBUG]);

  // autoplay 10s (só se houver mais de 1)
  useEffect(() => {
    if (mangas.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % mangas.length), 10000);
    return () => clearInterval(t);
  }, [mangas.length]);

  if (!mangas.length) return null;

  const m = mangas[idx];
  const cover = m?.coverUrl || m?.cover || m?.capa;
  const coverUrl = buildCoverUrl(apiBase, cover, DEBUG, placeholder);

  return (
    <section className="bg-zinc-800 text-white py-6 px-4 md:px-8 overflow-hidden relative rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Últimos Mangás Publicados
      </h2>

      <div className="relative overflow-hidden rounded-lg h-[380px] md:h-[440px]">
        {/* fundo blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-md brightness-50 scale-110"
          style={{ backgroundImage: `url(${coverUrl})` }}
        />

        {/* conteúdo */}
        <div className="relative z-10 flex flex-col md:flex-row h-full px-2 sm:px-6 items-center justify-between">
          <div className="text-left max-w-xl">
            <h3 className="text-3xl font-bold drop-shadow">{m.title}</h3>
            {m.synopsis && <p className="mt-4 text-gray-200">{m.synopsis}</p>}
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
                clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <Image
                src={coverUrl}
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
