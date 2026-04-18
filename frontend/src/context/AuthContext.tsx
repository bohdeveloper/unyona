import { createContext, useContext, useEffect, useState } from "react";
interface PerfilActivo {
  nombrePerfil: string;
  avatar: string;
  esInfantil: boolean;
}
interface AuthContextType {
  token: string | null;
  perfilActivo: PerfilActivo | null;
  login: (token: string) => void;
  seleccionarPerfil: (token: string, perfil: PerfilActivo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [perfilActivo, setPerfilActivo] = useState<PerfilActivo | null>(null);

  // 🔄 Cargar sesión desde localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedPerfil = localStorage.getItem("perfilActivo");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedPerfil) {
      setPerfilActivo(JSON.parse(storedPerfil));
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const seleccionarPerfil = (newToken: string, perfil: PerfilActivo) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("perfilActivo", JSON.stringify(perfil));
    setToken(newToken);
    setPerfilActivo(perfil);
  };

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
        login,
        seleccionarPerfil,
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