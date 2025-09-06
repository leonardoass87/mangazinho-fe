// src/components/Sidebar.js
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

// helpers estáveis (fora do componente)
const trimSlashEnd = (s) => (s && s.endsWith("/") ? s.slice(0, -1) : s);
const trimSlashStart = (s) => (s && s.startsWith("/") ? s.slice(1) : s);
const joinUrl = (base, part) =>
  `${trimSlashEnd(base || "")}/${trimSlashStart(part || "")}`;

export default function Sidebar() {
  const [mangas, setMangas] = useState([]);

  const DEBUG =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_DEBUG === "true";

  // backend em 4000
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const placeholder = "/vercel.svg";

  const getCoverSrc = (m) => {
    const path = m?.coverUrl || m?.cover || m?.capa;
    if (!path) return placeholder;

    if (typeof path === "string" && /^https?:\/\//i.test(path)) {
      if (DEBUG) console.log("[Sidebar] cover abs:", path);
      return path;
    }
    if (typeof path === "string" && path.startsWith("/files")) {
      const url = joinUrl(apiBase, path);
      if (DEBUG) console.log("[Sidebar] cover rel(/files):", url);
      return url;
    }
    const url = joinUrl(apiBase, joinUrl("/files", path));
    if (DEBUG) console.log("[Sidebar] cover rel:", url);
    return url;
  };

  useEffect(() => {
    (async () => {
      const url = joinUrl(apiBase, "/mangas");
      try {
        if (DEBUG) console.log("[Sidebar] GET", url);
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          if (DEBUG) console.warn("[Sidebar] /mangas not ok:", res.status, t);
          setMangas([]);
          return;
        }
        const data = await res.json().catch(() => []);
        const list = Array.isArray(data) ? data : [];
        setMangas(list.slice(0, 5));
      } catch (e) {
        console.error("[Sidebar] erro:", e);
        setMangas([]);
      }
    })();
  }, [DEBUG, apiBase]); // helpers estão fora do componente, logo não entram nas deps

  return (
    <aside className="bg-white/5 rounded-lg shadow p-4 h-fit">
      <h3 className="text-white font-semibold mb-3">🔥 Populares</h3>
      <ul className="space-y-3">
        {mangas.length === 0 && (
          <li className="text-gray-400 text-sm">Sem dados ainda.</li>
        )}

        {mangas.map((m) => {
          const src = getCoverSrc(m);
          return (
            <li key={m.id} className="flex items-center gap-3">
              <div className="relative w-[50px] h-[70px] flex-shrink-0 overflow-hidden rounded">
                <Image src={src} alt={m.title} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate">{m.title}</div>
                {m.synopsis && (
                  <div className="text-gray-400 text-xs truncate">{m.synopsis}</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
