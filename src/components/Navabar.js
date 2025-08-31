"use client";
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4">
      <div className="font-bold text-lg">📚 Mangazinho</div>
      
      <nav className="space-x-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Todos</a>
        {isAdmin() && (
          <a href="/admin" className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm transition">
            Admin
          </a>
        )}
      </nav>
      
      <div className="relative">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-300">
              Olá, <span className="font-medium text-white">{user.username}</span>
              {isAdmin() && (
                <span className="ml-2 bg-red-600 px-2 py-1 rounded text-xs">Admin</span>
              )}
            </div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition"
            >
              ⚙️
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
                  >
                    🚪 Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <a href="/login" className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded transition">
            Login
          </a>
        )}
      </div>
      
      {/* Overlay para fechar dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}
