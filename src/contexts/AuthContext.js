"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

// DEBUG ligado fora de produção ou se NEXT_PUBLIC_DEBUG=true
const DEBUG =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_DEBUG === "true";

// Helper para ler resposta sem “consumir” o stream original
async function readResponseSafe(res) {
  const clone = res.clone();
  const text = await clone.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // mantém null se não for JSON
  }
  return { text, json };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBase) {
    console.error("❌ NEXT_PUBLIC_API_URL não definido no .env do FRONT");
  } else if (DEBUG) {
    console.log("📡 [Auth] API Base:", apiBase);
  }

  // ---------- boot: ler token do localStorage e validar ----------
  useEffect(() => {
    const savedToken =
      typeof window !== "undefined"
        ? localStorage.getItem("mangazinho_token")
        : null;

    if (savedToken && apiBase) {
      setToken(savedToken);
      (async () => {
        try {
          if (DEBUG) {
            console.group("[Auth] verify on boot");
            console.log("GET", `${apiBase}/auth/me`);
          }
          const res = await fetch(`${apiBase}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          const { text, json } = await readResponseSafe(res);

          if (DEBUG) {
            console.log("status:", res.status, "ok:", res.ok);
            console.log("raw:", text);
            console.log("json:", json);
          }

          if (res.ok && json && json.user) {
            setUser(json.user);
          } else {
            if (DEBUG)
              console.warn("[Auth] token inválido ao iniciar, limpando...");
            logout();
          }
        } catch (err) {
          console.error("[Auth] erro ao verificar token no boot:", err);
          logout();
        } finally {
          setLoading(false);
          if (DEBUG) console.groupEnd?.();
        }
      })();
    } else {
      setLoading(false);
    }
  }, [apiBase]);

  // ---------- verifyToken sob demanda ----------
  const verifyToken = useCallback(
    async (tokenToVerify) => {
      if (!apiBase) return;
      try {
        if (DEBUG) {
          console.group("[Auth] verifyToken");
          console.log("GET", `${apiBase}/auth/me`);
        }
        const res = await fetch(`${apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${tokenToVerify}` },
        });
        const { text, json } = await readResponseSafe(res);

        if (DEBUG) {
          console.log("status:", res.status, "ok:", res.ok);
          console.log("raw:", text);
          console.log("json:", json);
        }

        if (res.ok && json && json.user) {
          setUser(json.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error("[Auth] erro verifyToken:", err);
        logout();
      } finally {
        setLoading(false);
        if (DEBUG) console.groupEnd?.();
      }
    },
    [apiBase]
  );

  // ---------- login ----------
  const login = async (username, password) => {
    if (!apiBase) {
      return { success: false, message: "API não configurada (NEXT_PUBLIC_API_URL)" };
    }

    const url = `${apiBase}/auth/login`;
    const payload = { username, password };

    try {
      if (DEBUG) {
        console.group("[Auth] login");
        console.log("POST", url);
        console.log("payload:", { username, passwordLen: password?.length ?? 0 }); // não loga senha
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Se o back usar cookie httpOnly, habilite:
        // credentials: "include",
        body: JSON.stringify(payload),
      });

      const { text, json } = await readResponseSafe(res);

      if (DEBUG) {
        console.log("status:", res.status, "ok:", res.ok);
        console.log("raw:", text);
        console.log("json:", json);
      }

      if (!res.ok) {
        const msg = (json && (json.message || json.error)) || `HTTP ${res.status}`;
        return { success: false, message: msg };
      }

      if (json && json.token) {
        setToken(json.token);
        if (typeof window !== "undefined") {
          localStorage.setItem("mangazinho_token", json.token);
        }
      }
      if (json && json.user) {
        setUser(json.user);
      }
      return { success: true, message: (json && json.message) || "Login OK", data: json };
    } catch (err) {
      console.error("[Auth] erro login fetch:", err);
      return { success: false, message: "Erro de conexão" };
    } finally {
      if (DEBUG) console.groupEnd?.();
    }
  };

  // ---------- register ----------
  const register = async (username, email, password) => {
    if (!apiBase) {
      return { success: false, message: "API não configurada (NEXT_PUBLIC_API_URL)" };
    }

    const url = `${apiBase}/auth/register`;
    const payload = { username, email, password };

    try {
      if (DEBUG) {
        console.group("[Auth] register");
        console.log("POST", url);
        console.log("payload:", { username, email, passwordLen: password?.length ?? 0 });
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include",
        body: JSON.stringify(payload),
      });

      const { text, json } = await readResponseSafe(res);

      if (DEBUG) {
        console.log("status:", res.status, "ok:", res.ok);
        console.log("raw:", text);
        console.log("json:", json);
      }

      if (!res.ok) {
        const msg = (json && (json.message || json.error)) || `HTTP ${res.status}`;
        return { success: false, message: msg };
      }

      if (json && json.token) {
        setToken(json.token);
        if (typeof window !== "undefined") {
          localStorage.setItem("mangazinho_token", json.token);
        }
      }
      if (json && json.user) {
        setUser(json.user);
      }
      return { success: true, message: (json && json.message) || "Registro OK", data: json };
    } catch (err) {
      console.error("[Auth] erro register fetch:", err);
      return { success: false, message: "Erro de conexão" };
    } finally {
      if (DEBUG) console.groupEnd?.();
    }
  };

  // ---------- logout ----------
  const logout = () => {
    if (DEBUG) console.log("[Auth] logout");
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mangazinho_token");
    }
  };

  // ---------- helpers ----------
  const isAdmin = () => !!user && Number(user.role) === 1;

  const getAuthHeaders = () =>
    token ? { Authorization: `Bearer ${token}` } : {};

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    getAuthHeaders,
    verifyToken, // exposto caso queira chamar manualmente
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
