export default function Navbar() {
  return (
    <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4">
      <div className="font-bold text-lg">📚 Mangazinho</div>
      <nav className="space-x-4">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Todos</a>
      </nav>
      <button className="bg-indigo-500 px-4 py-2 rounded">Login</button>
    </header>
  );
}
