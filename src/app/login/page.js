"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

// Desabilitar prerenderização estática
export const dynamic = 'force-dynamic';

// DEBUG: ligado fora de produção ou se NEXT_PUBLIC_DEBUG=true
const DEBUG =
  process.env.NODE_ENV !== 'production' ||
  process.env.NEXT_PUBLIC_DEBUG === 'true';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (DEBUG) {
        console.group('[LoginPage] handleSubmit');
        console.log('isLogin:', isLogin);
        console.log('payload:', {
          username: formData.username,
          email: !isLogin ? formData.email : undefined,
          passwordLen: formData.password?.length ?? 0
        });
      }

      let result;

      if (isLogin) {
        // Login
        result = await login(formData.username, formData.password);
      } else {
        // Registro
        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem');
          if (DEBUG) {
            console.warn('[LoginPage] senha e confirmação divergentes');
            console.groupEnd?.();
          }
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres');
          if (DEBUG) {
            console.warn('[LoginPage] senha curta (<6)');
            console.groupEnd?.();
          }
          setLoading(false);
          return;
        }
        result = await register(formData.username, formData.email, formData.password);
      }

      if (DEBUG) {
        console.log('result from AuthContext:', result);
      }

      if (result?.success) {
        setSuccess(result.message || (isLogin ? 'Login OK' : 'Registro OK'));
        if (DEBUG) console.log('[LoginPage] sucesso → redirecionando para "/" em 1.5s');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setError(result?.message || 'Falha no login/registro');
        if (DEBUG) console.warn('[LoginPage] falha:', result?.message);
      }
    } catch (err) {
      console.error('[LoginPage] erro inesperado', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
      if (DEBUG) console.groupEnd?.();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (DEBUG && name !== 'password' && name !== 'confirmPassword') {
      // Evita logar senha; útil para ver o fluxo de digitação
      console.log('[LoginPage] input change:', { [name]: value });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    if (DEBUG) console.log('[LoginPage] toggleMode → isLogin:', !isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mangazinho</h1>
          <p className="text-gray-300">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
          {DEBUG && (
            <p className="text-xs text-yellow-200 mt-2">
              DEBUG ON — API: {process.env.NEXT_PUBLIC_API_URL || '(não definida)'}
            </p>
          )}
        </div>

        {/* Card de Login/Registro */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Tabs */}
          <div className="flex mb-6 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Registrar
            </button>
          </div>

          {/* Mensagens */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Digite seu username"
                required
              />
            </div>

            {/* Email (apenas no registro) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Digite seu email"
                  required
                />
              </div>
            )}

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Digite sua senha"
                required
              />
            </div>

            {/* Confirmar Senha (apenas no registro) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Confirme sua senha"
                  required
                />
              </div>
            )}

            {/* Botão de Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Entrando...' : 'Registrando...'}
                </div>
              ) : (
                isLogin ? 'Entrar' : 'Registrar'
              )}
            </button>
          </form>

          {/* Link para alternar modo */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              {isLogin 
                ? "Não tem uma conta? Registre-se" 
                : "Já tem uma conta? Entre aqui"
              }
            </button>
          </div>

          {/* Link para home */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Voltar para o site
            </Link>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 text-center text-gray-400 text-xs">
          <p>Credenciais de teste para admin:</p>
          <p>Username: admin | Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
