// src/components/Sidebar.js
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [mangas, setMangas] = useState([]);
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
  const filesBase = (process.env.NEXT_PUBLIC_FILES_URL ?? "http://localhost:3000") + "";
  const placeholder = "/vercel.svg";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase}/mangas`);
        const data = await res.json();
        setMangas((data || []).slice(0, 5)); // 5 mais recentes
      } catch (e) {
        console.error("Sidebar erro:", e);
      }
    })();
  }, [apiBase]);

  return (
    <aside className="bg-white/5 rounded-lg shadow p-4 h-fit">
      <h3 className="text-white font-semibold mb-3">🔥 Populares</h3>
      <ul className="space-y-3">
        {mangas.length === 0 && (
          <li className="text-gray-400 text-sm">Sem dados ainda.</li>
        )}

        {mangas.map((m) => {
          const src = m.coverUrl
            ? (m.coverUrl.startsWith("http") ? m.coverUrl : `${filesBase}${m.coverUrl}`)
            : placeholder;

          return (
            <li key={m.id} className="flex items-center gap-3">
              <div className="relative w-[50px] h-[70px] flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={src}
                  alt={m.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {m.title}
                </div>
                {m.synopsis && (
                  <div className="text-gray-400 text-xs truncate">
                    {m.synopsis}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
