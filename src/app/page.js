import Navbar from "@/components/Navabar";
import Carousel from "@/components/Carousel";

export default function Home() {
  return (
    <div>
      <Navbar/>    
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold my-6">Bem-vindo ao Mangazinho</h1>
        <Carousel/>
        <p className="text-gray-600">
          Aqui vai entrar o grid de cards e a sidebar 🔥
        </p>
      </main>

      <footer className="bg-gray-900 text-white text-center py-4 mt-8">
        © 2025 Mangazinho - Todos os direitos reservados.
      </footer>
    </div>
  );
}
