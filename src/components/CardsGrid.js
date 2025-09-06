// src/components/CardsGrid.js
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* Helpers estáveis (fora do componente) */
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

const buildCoverUrl = (apiBase, rawPath, DEBUG, placeholder = "/vercel.svg") => {
  if (!rawPath) return placeholder;

  // absoluta
  if (/^https?:\/\//i.test(rawPath)) {
    if (DEBUG) console.log("[CardsGrid] cover abs:", rawPath);
    return rawPath;
  }
  // já começa com /files
  if (rawPath.startsWith("/files")) {
    const url = joinUrl(apiBase, rawPath);
    if (DEBUG) console.log("[CardsGrid] cover rel(/files):", url);
    return url;
  }
  // relativo (ex.: mangas/xxx/cover.jpg)
  const url = joinUrl(apiBase, joinUrl("/files", rawPath));
  if (DEBUG) console.log("[CardsGrid] cover rel:", url);
  return url;
};

export default function CardsGrid() {
  const [mangas, setMangas] = useState([]);

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
        if (DEBUG) console.log("[CardsGrid] GET", url);
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          if (DEBUG) console.warn("[CardsGrid] /mangas not ok:", res.status, t);
          setMangas([]);
          return;
        }
        const data = await res.json().catch(() => []);
        setMangas(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("[CardsGrid] erro:", e);
        setMangas([]);
      }
    })();
  }, [apiBase, DEBUG]);

  if (!mangas.length) {
    return <div className="text-gray-400">Ainda não há mangás publicados.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {mangas.map((m) => {
        const rawPath = pickCoverPath(m);
        const src = buildCoverUrl(apiBase, rawPath, DEBUG, placeholder);

        return (
          <Link key={m.id} href={`/manga/${m.id}`} className="block">
            <article className="bg-white/5 rounded-lg overflow-hidden shadow hover:-translate-y-0.5 hover:shadow-lg transition">
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
                  <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                    {m.synopsis}
                  </p>
                )}
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
