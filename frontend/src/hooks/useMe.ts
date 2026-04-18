import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function useMe() {
  const { token } = useAuth();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsuario(data));
  }, [token]);

  return usuario;
}