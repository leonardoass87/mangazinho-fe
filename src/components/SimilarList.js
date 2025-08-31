// src/app/components/SimilarList.js
export default function SimilarList({ items = [] }) {
  const data = items.length
    ? items
    : [
        { id: "naruto", title: "Naruto", cover: "https://cdn.myanimelist.net/images/manga/3/117681.jpg" },
        { id: "aot", title: "Attack on Titan", cover: "https://cdn.myanimelist.net/images/manga/2/37846.jpg" },
        { id: "db", title: "Dragon Ball", cover: "https://cdn.myanimelist.net/images/manga/3/179300.jpg" },
        { id: "dn", title: "Death Note", cover: "https://cdn.myanimelist.net/images/manga/1/258245.jpg" },
      ];

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3">Obras semelhantes</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {data.map((it) => (
          <div key={it.id} className="bg-zinc-800 rounded-lg w-[150px] flex-shrink-0 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.cover} alt={it.title} className="w-full h-[200px] object-cover rounded" />
            <p className="text-center mt-2 text-sm">{it.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
