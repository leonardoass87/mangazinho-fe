// src/app/components/ChaptersList.js
import Link from "next/link";

export default function ChaptersList({ mangaId, chapters = [], totalChapters = 0 }) {
  // Se ainda não tem capítulos no back, gera a lista a partir do totalChapters
  const items = chapters.length
    ? chapters // [{ number: 143, title: "Capítulo 143" }, ...]
    : Array.from({ length: totalChapters || 0 }, (_, i) => {
        const n = (totalChapters || 0) - i; // ordem decrescente
        return { number: n, title: `Capítulo ${n}` };
      });

  const firstNumber = items.length ? items[items.length - 1].number : 1;
  const lastNumber = items.length ? items[0].number : 1;

  return (
    <section className="mt-8">
      <div className="flex gap-2 mb-4">
        <Link
          href={`/manga/${mangaId}/capitulo/${String(firstNumber)}`}
          className="flex-1 text-center bg-red-800 hover:bg-red-700 transition rounded px-4 py-2 font-semibold"
        >
          📖 Capítulo 01
        </Link>
        <Link
          href={`/manga/${mangaId}/capitulo/${String(lastNumber)}`}
          className="flex-1 text-center bg-red-900 hover:bg-red-800 transition rounded px-4 py-2 font-semibold"
        >
          🔥 Último
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {items.map((ch) => (
          <Link
            key={ch.number}
            href={`/manga/${mangaId}/capitulo/${String(ch.number)}`}
            className="bg-zinc-800 hover:bg-zinc-700 transition rounded p-3 text-center"
          >
            {`Capítulo ${String(ch.number).padStart(2, "0")}`}
          </Link>
        ))}
      </div>
    </section>
  );
}
