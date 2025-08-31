"use client";
import { useEffect, useState } from "react";

export default function ReaderUI() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight || 1;
      const viewport = window.innerHeight || 1;
      const total = Math.max(docHeight - viewport, 1);
      const pct = Math.min(100, Math.max(0, (scrollTop / total) * 100));
      setProgress(pct);
      setShowTop(scrollTop > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/30 z-40">
        <div
          className="h-full bg-yellow-400 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
          aria-label="Progresso de leitura"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        />
      </div>

      {/* Scroll to top button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed right-3 bottom-3 sm:right-6 sm:bottom-6 z-40 rounded-full shadow-lg bg-yellow-400 text-black px-4 py-2 transition-opacity ${showTop ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-label="Voltar ao topo"
      >
        ↑ Topo
      </button>
    </>
  );
}


