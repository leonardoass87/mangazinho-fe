import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";

import Sidebar from "@/components/Sidebar";
import CardsGrid from "@/components/CardsGrid";


export default function Home() {
  return (
    <div>
      <Navbar />
      {/* //mantenha UM container aqui e remova containers internos dos componentes */}
      <main className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold my-6">Bem-vindo ao Mangazinho</h1>

    

        <div className="mt-6">
          <Carousel /> {/* sem max-w/mx-auto interno */}
        </div>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3">
            <CardsGrid/> {/* não use max-w/p-4 dentro */}
          </div>
          <div className="lg:col-span-1">
            <Sidebar /> {/* idem */}
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white text-center py-4 mt-8">
        © 2025 Mangazinho - Todos os direitos reservados.
      </footer>
    </div>
  );
}
