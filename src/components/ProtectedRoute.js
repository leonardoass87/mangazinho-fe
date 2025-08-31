"use client";
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Usuário não está logado, redirecionar para login
        router.push('/login');
        return;
      }

      if (requireAdmin && !isAdmin()) {
        // Usuário não é admin, redirecionar para home
        router.push('/');
        return;
      }
    }
  }, [user, loading, requireAdmin, isAdmin, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está logado ou não é admin (quando requerido), não renderizar nada
  if (!user || (requireAdmin && !isAdmin())) {
    return null;
  }

  // Renderizar conteúdo protegido
  return children;
}
