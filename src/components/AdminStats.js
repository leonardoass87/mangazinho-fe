export default function AdminStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 hover:bg-blue-600/30 transition">
        <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
        <div className="text-sm text-gray-300">Total de Mangás</div>
        <div className="text-xs text-gray-400 mt-1">
          {stats.total > 0 ? `${((stats.withCover / stats.total) * 100).toFixed(1)}% com capa` : 'Nenhum mangá'}
        </div>
      </div>
      
      <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 hover:bg-green-600/30 transition">
        <div className="text-2xl font-bold text-green-400">{stats.withCover}</div>
        <div className="text-sm text-gray-300">Com Capa</div>
        <div className="text-xs text-gray-400 mt-1">
          {stats.total > 0 ? `${((stats.withCover / stats.total) * 100).toFixed(1)}% do total` : '0%'}
        </div>
      </div>
      
      <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-4 hover:bg-orange-600/30 transition">
        <div className="text-2xl font-bold text-orange-400">{stats.withChapters}</div>
        <div className="text-sm text-gray-300">Com Capítulos</div>
        <div className="text-xs text-gray-400 mt-1">
          {stats.total > 0 ? `${((stats.withChapters / stats.total) * 100).toFixed(1)}% do total` : '0%'}
        </div>
      </div>
      
      <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 hover:bg-purple-600/30 transition">
        <div className="text-2xl font-bold text-purple-400">{stats.completed}</div>
        <div className="text-sm text-gray-300">Concluídos</div>
        <div className="text-xs text-gray-400 mt-1">
          {stats.total > 0 ? `${((stats.completed / stats.total) * 100).toFixed(1)}% do total` : '0%'}
        </div>
      </div>
    </div>
  );
}
