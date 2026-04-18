import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/* Login / Token guardado con AuthContext / Estado global actualizado */
export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      // Guardamos el token
      login(data.token);
      console.log("Acceso correcto:", data.usuario);

      // Redirigimos a perfiles
      navigate("/perfiles");

    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4 mt-20 bg-cyan-100 pt-5 pb-5 pr-20 pl-20 rounded-xl">
      <h1 className="text-xl font-bold">Iniciar sesión</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 rounded text-cyan-700 border-2 outline-none"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 rounded text-cyan-700 border-2 outline-none"
      />

      {error && <p className="text-rose-400">{error}</p>}

      <button className="w-full bg-rose-100 hover:bg-rose-300 transition text-cyan-300 hover:text-cyan-200 p-2 rounded">
        Entrar
      </button>
    </form>
  );
}