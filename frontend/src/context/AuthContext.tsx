import { createContext, useContext, useEffect, useState } from "react";

/**
 * Información del perfil activo
 */
export interface PerfilActivo {
  id: number;
  nombrePerfil: string;
  avatar: string;
  esInfantil: boolean;
}

interface AuthContextType {
  token: string | null;
  perfilActivo: PerfilActivo | null;
  isReady: boolean;

  login: (token: string) => void;
  seleccionarPerfil: (token: string, perfil: PerfilActivo) => void;
  actualizarPerfilActivo: (perfil: PerfilActivo) => void;
  limpiarPerfil: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [perfilActivo, setPerfilActivo] = useState<PerfilActivo | null>(null);
  const [isReady, setIsReady] = useState(false);

  /**
   * Cargar sesión desde localStorage
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedPerfil = localStorage.getItem("perfilActivo");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedPerfil) {
      try {
        setPerfilActivo(JSON.parse(storedPerfil));
      } catch {
        localStorage.removeItem("perfilActivo");
      }
    }

    setIsReady(true);
  }, []);

  /**
   * Login solo de usuario (sin perfil)
   */
  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    localStorage.removeItem("perfilActivo");

    setToken(newToken);
    setPerfilActivo(null);
  };

  /**
   * Seleccionar perfil activo
   */
  const seleccionarPerfil = (newToken: string, perfil: PerfilActivo) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("perfilActivo", JSON.stringify(perfil));

    setToken(newToken);
    setPerfilActivo(perfil);
  };

  /**
   * Actualizar datos del perfil activo (ej. nombre, avatar)
   */
  const actualizarPerfilActivo = (perfilActualizado: PerfilActivo) => {
    setPerfilActivo(prev => {
      if (!prev || prev.id !== perfilActualizado.id) return prev;

      localStorage.setItem(
        "perfilActivo",
        JSON.stringify(perfilActualizado)
      );

      return perfilActualizado;
    });
  };

  /**
   * Quitar perfil activo (cambiar de perfil)
   */
  const limpiarPerfil = () => {
    localStorage.removeItem("perfilActivo");
    setPerfilActivo(null);
  };

  /**
   * Logout completo
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("perfilActivo");

    setToken(null);
    setPerfilActivo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        perfilActivo,
        isReady,
        login,
        seleccionarPerfil,
        actualizarPerfilActivo,
        limpiarPerfil,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}