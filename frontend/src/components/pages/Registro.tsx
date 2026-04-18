import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Registro.css'

type FormErrores = {
  nombre?: boolean;
  apellido1?: boolean;
  apellido2?: boolean;
  email?: boolean;
  password?: boolean;
  fechaNacimiento?: boolean;
};

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [error, setError] = useState("");
  const [errores, setErrores] = useState<FormErrores>({});
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrores = {};

    if (!nombre.trim()) newErrors.nombre = true;
    if (!apellido1.trim()) newErrors.apellido1 = true;
    if (!apellido2.trim()) newErrors.apellido2 = true;
    if (!email.trim()) newErrors.email = true;
    if (!password.trim()) newErrors.password = true;
    if (!fechaNacimiento) newErrors.fechaNacimiento = true;

    setErrores(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setFormError("Los campos requeridos son obligatorios");
      return false;
    }

    setFormError(null);
    return true;
  };

/* Llamada POST / Manejo de errores / Guardado del token */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, apellido1, apellido2, email, password, fechaNacimiento })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al registrarse");
        return;
      }
      // Guardamos el token de usuario
      login(data.token);
      console.log("Usuario registrado:", data.usuario);

      // Redirigimos al inicio
      navigate("/perfiles");

    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto space-y-4 bg-cyan-100 pt-5 pb-5 pr-20 pl-20 rounded-xl">
      <h1 className="text-xl font-bold text-cyan-700">Registro</h1>

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-cyan-700 mb-1">
          Nombre <span className="text-rose-400">*</span>
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={`w-full p-2 rounded text-cyan-700 border-2 outline-none
            ${errores.nombre
              ? "border-rose-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-gray-400"
            }`}
        />
      </div>

      {/* Primer apellido */}
      <div>
        <label htmlFor="apellido1" className="block text-sm font-medium text-cyan-700 mb-1">
          Primer apellido <span className="text-rose-400">*</span>
        </label>
        <input
          id="apellido1"
          type="text"
          value={apellido1}
          onChange={(e) => setApellido1(e.target.value)}
          className={`w-full p-2 rounded text-cyan-700 border-2 outline-none
            ${errores.apellido1
              ? "border-rose-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-gray-400"
            }`}
        />
      </div>

      {/* Segundo apellido */}
      <div>
        <label htmlFor="apellido2" className="block text-sm font-medium text-cyan-700 mb-1">
          Segundo apellido <span className="text-rose-400">*</span>
        </label>
        <input
          id="apellido2"
          type="text"
          value={apellido2}
          onChange={(e) => setApellido2(e.target.value)}
          className={`w-full p-2 rounded text-cyan-700 border-2 outline-none
            ${errores.apellido2
              ? "border-rose-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-gray-400"
            }`}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-cyan-700 mb-1">
          Email <span className="text-rose-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2 rounded text-cyan-700 border-2 outline-none
            ${errores.email
              ? "border-rose-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-gray-400"
            }`}
        />
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-cyan-700 mb-1">
          Contraseña <span className="text-rose-400">*</span>
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-2 rounded text-cyan-700 border-2 outline-none
            ${errores.password
              ? "border-rose-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-gray-400"
            }`}
        />
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-cyan-700 mb-1">
          Fecha de nacimiento <span className="text-rose-400">*</span>
        </label>
        <input
          id="fechaNacimiento"
          type="date"
          value={fechaNacimiento}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          onKeyDown={(e) => e.preventDefault()}
          className={`w-full p-2 rounded text-cyan-600 border-2 outline-none
            ${errores.fechaNacimiento
              ? "border-rose-400 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-gray-400"
            }`}
        />
      </div>

      {/* Mensajes de error */}
      {error && (
        <p className="text-rose-400 text-sm text-center">
          {error}
        </p>
      )}

      {formError && (
        <p className="text-rose-400 text-sm text-center">
          {formError}
        </p>
      )}

      {/* Botón */}
      <button className="w-full bg-rose-100 hover:bg-rose-300 transition text-cyan-300 hover:text-cyan-200 p-2 rounded">
        Crear cuenta
      </button>
    </form>
  );
}